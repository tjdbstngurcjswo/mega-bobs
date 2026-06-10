---
description: '[PR 자동 생성] diff 분석 → Walkthrough 요약 / 파일 그룹 Changes 테이블 / Mermaid 시퀀스 / 테스트 플랜 포함 PR 본문 생성 후 gh pr create'
argument-hint: '[target-branch] (선택, 기본 dev)'
allowed-tools: Bash(git:*), Bash(gh:*), Read, Grep
---

# PR 생성 커맨드

PR 생성 요청 시 아래 절차를 **순서대로** 실행합니다.

## STEP 0: 사전 정리 (선택)

> 사용자가 명시적으로 요청한 경우에만 실행합니다. 기본 PR 생성 흐름에서는 건너뜁니다.

### 0-1. 데드코드 제거

`.claude/commands/purge-dead-code.md` 를 **Read** 로 읽고, 그 안의 절차를 순서대로 실행합니다.

- 제거할 항목이 있으면 정리 후 커밋합니다.
- 없으면 "데드코드 없음" 보고 후 0-2로 진행합니다.

### 0-2. README 최신화 확인

`.claude/skills/readme-sync/SKILL.md` 를 **Read** 로 읽고, 그 안의 절차를 순서대로 실행합니다.

- README 수정이 발생하면 커밋 후 STEP 1로 진행합니다.
- 최신 상태이면 결과 보고 후 바로 STEP 1로 진행합니다.

## STEP 1: 정보 수집

다음 명령을 **병렬**로 실행하여 정보를 수집합니다:

```bash
# 1. 현재 브랜치와 상태
git branch --show-current
git status

# 2. 타겟 브랜치 대비 커밋 히스토리
git log --oneline <target-branch>..HEAD

# 3. 타겟 브랜치 대비 변경 파일 통계
git diff <target-branch>...HEAD --stat

# 4. 타겟 브랜치 대비 전체 diff
git diff <target-branch>...HEAD

# 5. 리모트 브랜치 존재 여부 + 포크 감지
git branch -r | grep <current-branch>
git remote get-url upstream 2>/dev/null && echo "FORKED" || echo "DIRECT"
```

**포크 감지 규칙:**

- `upstream` 리모트가 존재하면 → **포크된 레포** (STEP 5에서 upstream 경로 사용)
- `upstream` 리모트가 없으면 → **직접 레포** (기존 origin 경로 사용)

**타겟 브랜치 결정 규칙:**

- 사용자가 명시한 경우 → 해당 브랜치
- 명시하지 않은 경우 → `dev` (기본값)
- 현재 브랜치가 `dev` 자체이거나 핫픽스(`hotfix/*`)면 → `main`
- 포크된 레포: `upstream/<target>` 기준, 직접 레포: `origin/<target>` 기준

## STEP 2: 변경 분석

수집한 diff를 기반으로 아래 항목을 분석합니다:

1. **변경 유형 판별**: feat / fix / refactor / chore / style / docs / test / mixed
2. **파일 그룹핑**: 관련 파일을 Cohort(응집 단위)로 묶기
3. **흐름 파악**: 사용자 액션 → 프론트엔드 → API → 백엔드 순서의 실행 흐름
4. **영향 범위**: 어떤 사용자/페이지/플랫폼에 영향이 있는지

## STEP 3: PR 본문 작성

아래 **정확한 템플릿**으로 PR body를 생성합니다:

````markdown
## 개요

> **한줄 요약**: {변경의 핵심을 한 문장으로. 리뷰어가 3초 안에 맥락 파악 가능해야 함}

{1~3문장으로 상세 배경 설명. 왜 이 변경이 필요했는지, 어떤 문제를 해결하는지.
긴 문장은 줄바꿈하여 가독성 확보}

&nbsp;

## 변경 사항

| 변경 그룹       | 파일                     | 요약        |
| --------------- | ------------------------ | ----------- |
| **{그룹 이름}** | `{파일명1}`, `{파일명2}` | {변경 요약} |
| **{그룹 이름}** | `{파일명}`               | {변경 요약} |

&nbsp;

## 실행 흐름

```mermaid
sequenceDiagram
    participant {한글alias}
    participant {한글alias} as {컴포넌트명}
    ...
```

&nbsp;

## 주요 리뷰 요청사항

- {리뷰어가 특히 봐줬으면 하는 포인트}
- {이 방식이 맞는지 의견이 필요한 부분}

&nbsp;

## 테스트 계획

- [ ] {테스트 항목 1}
- [ ] {테스트 항목 2}
- [ ] {기존 기능 미영향 확인}

---

> 🎭 **오늘의 커밋 시**
>
> {이 PR의 변경 내용을 위트있는 짧은 시로 요약. 3~5줄, 개그 요소 + 이모지 포함}

🤖 Generated with [Claude Code](https://claude.com/claude-code)
````

### 섹션 간격 규칙 (GitHub 렌더링)

GitHub 마크다운에서 섹션이 붙어 보이지 않도록, 각 `##` 섹션 사이에 `&nbsp;` (빈 줄 + non-breaking space + 빈 줄)을 삽입한다.
개요 본문이 길면 문장 단위로 줄바꿈하여 GitHub에서 단락이 분리되도록 한다.

### 템플릿 작성 규칙

**개요:**

- `> **한줄 요약**:` blockquote로 핵심 한 문장 먼저 제시 — 리뷰어가 PR 목록에서 3초 안에 맥락을 잡을 수 있어야 함
- 그 아래 1~3문장으로 배경과 이유 설명
- 기술 용어보다 **"왜" 이 변경이 필요했는지**에 집중
- 예:
  > **한줄 요약**: 식단 보드에 코스별 투표 UI 추가
  >
  > 기존에는 메뉴만 노출되고 선호도를 모았습니다. 코스 단위 투표 버튼과 결과 막대를 추가해 다음 날 블로그 정리에 활용합니다.

**변경 사항 테이블:**

- 3컬럼: `변경 그룹` | `파일` | `요약`
- 그룹 이름은 **볼드**, **짧고 직관적**으로 (예: "투표 로직", "UI 컴포넌트", "API 레이어")
- 파일은 **파일명만** 표시 (경로 생략). 동명 파일이 있을 때만 부모 디렉토리 1단계 포함
  - Good: `MenuSelector.tsx`, `getMenu.ts`
  - Bad: `src/components/MenuSelector.tsx`
- 요약은 **한국어**, 동사로 시작 (예: "코스별 투표 버튼 및 결과 막대 구현")
- 그룹은 최대 **5~6개** — 너무 많으면 리뷰어가 읽지 않음

**실행 흐름:**

- participant는 **최대 5~6개**. 너무 많으면 중간 레이어를 합치거나 생략
  - Bad: Controller, Service, Repository, Validator, Mapper 를 각각 분리 (8개)
  - Good: Backend(서비스+리포지토리), ExternalAPI 로 합치기 (5개)
- participant 이름은 **짧은 한글 alias** 권장 (예: `participant 식단보드 as MenuBoard`)
- `alt`/`else`로 핵심 분기만 표현 — 모든 에러 케이스를 넣지 말고 대표 흐름에 집중
- `Note`는 꼭 필요한 보충만 (재시도 횟수, 타임아웃 등)
- 단순 변경(스타일, 타입 추가 등)은 다이어그램 **생략**

**주요 리뷰 요청사항:**

- diff에서 설계 결정이 필요한 부분, 대안이 있었던 부분, 확신이 없는 부분을 추출
- 리뷰어가 집중해서 봐야 할 포인트를 1~3개로 정리
- 없으면 이 섹션 생략

**테스트 계획:**

- 체크박스(`- [ ]`) 형식
- 플랫폼별 테스트 (Desktop/Mobile) 분리
- 기존 기능 미영향 확인 항목 필수 포함
- 최소 3개, 최대 8개

## STEP 4: PR 제목 결정

커밋 컨벤션을 따릅니다:

```
type: [기능명]한줄 설명 (50자 이내, 끝에 마침표 금지)
```

- **type**: `feat` / `fix` / `refactor` / `chore` / `style` / `docs` / `test`
- **기능명**: 선택 항목, 최대 3단어로 대괄호 감싸기 (예: `[코스 투표]`)
- 복수 type이면 가장 큰 비중의 type 사용
- 예시:
  - `feat: [코스 투표]코스별 투표 UI 및 결과 막대 추가`
  - `fix: [식단보드]주말 식단 없음 상태 처리 수정`

## STEP 5: 푸시 및 PR 생성

**포크 여부에 따라 경로가 다릅니다. STEP 1에서 감지한 결과를 따릅니다.**

### 포크된 레포 (upstream 리모트 존재)

upstream → upstream 경로: 브랜치를 upstream에 직접 푸시하고, head에 fork prefix 없이 브랜치명만 사용한다.

```bash
# 1. HTTP 400 방지를 위해 postBuffer 설정 후 upstream에 브랜치 푸시
git config --local http.postBuffer 157286400
git push upstream <current-branch>

# 2. upstream repo slug 파싱 (https·ssh 양쪽 지원)
UPSTREAM_URL=$(git remote get-url upstream)
UPSTREAM_REPO=$(echo "$UPSTREAM_URL" \
  | sed 's|.*github\.com[:/]\(.*\)\.git|\1|' \
  | sed 's|.*github\.com[:/]\(.*\)|\1|')

# 3. Assignee 설정
ASSIGNEE="$(gh api user -q .login)"

# 4. upstream repo에 PR 생성 (--head는 브랜치명만, fork prefix 없음)
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

### 직접 레포 (upstream 리모트 없음)

```bash
# 1. origin에 브랜치 푸시
git push -u origin <current-branch>

# 2. Assignee 설정
ASSIGNEE="$(gh api user -q .login)"

# 3. PR 생성
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

PR 생성 후 아래 형식으로 보고합니다:

```
PR 생성 완료:
- **URL**: {PR URL}
- **방향**: {source-branch} → {upstream or origin}/{target-branch}
- **푸시 대상**: upstream (포크) / origin (직접)
- **Assignees**: {assignee1, assignee2}
```

## 머지 전략 참조 (MegaBobs 브랜치 전략)

| 머지 방향           | 전략             | 비고              |
| ------------------- | ---------------- | ----------------- |
| `feature/*` → `dev` | Squash and Merge | 기능 개발 통합    |
| `dev` → `main`      | Merge Commit     | 운영 배포(Vercel) |
| `hotfix/*` → `main` | Squash and Merge | 긴급 수정         |
| `hotfix/*` → `dev`  | Merge Commit     | hotfix 후 동기화  |

## 주의사항

- 리뷰 결과를 사용자에게 보여주고 **승인 후** PR 생성을 진행합니다
- unstaged/untracked 변경이 있으면 사용자에게 알리고 커밋 여부를 확인합니다
- `docs/` 등 untracked 디렉토리는 PR 범위에 포함하지 않습니다
- `main` 직접 Push 금지 — 반드시 PR로 머지
