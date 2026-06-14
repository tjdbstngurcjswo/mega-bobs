---
description: '[PR 자동 생성] diff 분석 → Walkthrough 요약 / 파일 그룹 Changes 테이블 / Mermaid 시퀀스 / 테스트 플랜 포함 PR 본문 생성 후 gh pr create'
argument-hint: '[target-branch] (선택, 기본 dev)'
allowed-tools: Bash(git:*), Bash(gh:*), Read, Grep
---

# PR 생성 커맨드

## STEP 1: 정보 수집

다음 명령을 **병렬**로 실행:

```bash
git branch --show-current && git status
git log --oneline <target-branch>..HEAD
git diff <target-branch>...HEAD --stat
git diff <target-branch>...HEAD
git remote get-url upstream 2>/dev/null && echo "FORKED" || echo "DIRECT"
```

**타겟 브랜치**: 명시된 경우 해당 브랜치, 없으면 `dev` (현재 브랜치가 `dev`거나 `hotfix/*`이면 `main`).
**포크 감지**: `upstream` 리모트 존재 → 포크 레포 (STEP 5에서 upstream 경로 사용).

## STEP 2: 변경 분석

1. 변경 유형 판별: feat / fix / refactor / chore / style / docs / test / mixed
2. 파일 그룹핑: 관련 파일을 응집 단위로 묶기
3. 사용자 액션 → 프론트 → API → 백엔드 실행 흐름 파악

## STEP 3: PR 본문 작성

아래 **정확한 템플릿**으로 PR body를 생성:

````markdown
## 개요

> **한줄 요약**: {변경의 핵심을 한 문장으로}

{1~3문장 배경 설명 — 왜 이 변경이 필요했는지}

&nbsp;

## 변경 사항

| 변경 그룹       | 파일                     | 요약        |
| --------------- | ------------------------ | ----------- |
| **{그룹 이름}** | `{파일명1}`, `{파일명2}` | {변경 요약} |

&nbsp;

## 실행 흐름

```mermaid
sequenceDiagram
    participant {한글alias}
    ...
```

&nbsp;

## 주요 리뷰 요청사항

- {리뷰어가 특히 봐줬으면 하는 포인트}

&nbsp;

## 테스트 계획

- [ ] {테스트 항목}
- [ ] 기존 기능 미영향 확인

---

> 🎭 **오늘의 커밋 시**
>
> {변경 내용을 위트있는 3~5줄 시로 요약, 이모지 포함}

🤖 Generated with [Claude Code](https://claude.com/claude-code)
````

**작성 규칙:**

- **개요**: blockquote 한줄 요약 먼저, 아래 1~3문장 배경·이유 설명 (기술 용어보다 "왜"에 집중)
- **변경 사항**: 파일명만 표기(경로 생략), 그룹 이름 볼드·최대 6개, 요약 한국어 동사 시작
- **실행 흐름**: participant 최대 6개, 짧은 한글 alias 권장, 단순 변경(스타일·타입)은 생략
- **리뷰 요청**: 설계 결정이 필요한 부분 1~3개, 없으면 섹션 생략
- **테스트 계획**: 체크박스, 플랫폼별 분리, 최소 3개·최대 8개
- 각 `##` 섹션 사이 `&nbsp;` 삽입 (GitHub 렌더링)

## STEP 4: PR 제목 결정

```
type: [기능명] 한줄 설명 (50자 이내, 마침표 금지)
```

`type`: feat / fix / refactor / chore / style / docs / test
예: `feat: [코스 투표] 코스별 투표 UI 및 결과 막대 추가`

## STEP 5: 푸시 및 PR 생성

### 포크된 레포 (upstream 리모트 존재)

```bash
git config --local http.postBuffer 157286400
git push upstream <current-branch>

UPSTREAM_URL=$(git remote get-url upstream)
UPSTREAM_REPO=$(echo "$UPSTREAM_URL" \
  | sed 's|.*github\.com[:/]\(.*\)\.git|\1|' \
  | sed 's|.*github\.com[:/]\(.*\)|\1|')
ASSIGNEE="$(gh api user -q .login)"

gh pr create \
  --repo "$UPSTREAM_REPO" \
  --base <target-branch> \
  --head <current-branch> \
  --title "<제목>" \
  --assignee "$ASSIGNEE" \
  --body "$(cat <<'EOF'
<본문>
EOF
)"
```

### 직접 레포

```bash
git push -u origin <current-branch>
ASSIGNEE="$(gh api user -q .login)"
gh pr create \
  --base <target-branch> \
  --title "<제목>" \
  --assignee "$ASSIGNEE" \
  --body "$(cat <<'EOF'
<본문>
EOF
)"
```

## STEP 6: 결과 보고

```
PR 생성 완료:
- URL: {PR URL}
- 방향: {branch} → {upstream or origin}/{target}
- Assignees: {assignee}
```

## 머지 전략

| 머지 방향           | 전략             |
| ------------------- | ---------------- |
| `feature/*` → `dev` | Squash and Merge |
| `dev` → `main`      | Merge Commit     |
| `hotfix/*` → `main` | Squash and Merge |
| `hotfix/*` → `dev`  | Merge Commit     |

## 주의사항

- PR 생성 전 본문을 사용자에게 보여주고 **승인 후** 진행
- unstaged 변경이 있으면 사용자에게 알리고 커밋 여부 확인
- `main` 직접 Push 금지
