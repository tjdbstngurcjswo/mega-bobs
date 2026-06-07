---
name: create-pr
description: Use when the user asks to create a GitHub PR (PR 만들어줘/올려줘, "PR 생성", draft PR) for the current branch. Analyzes the diff and generates a structured PR body — Walkthrough 요약, 파일 그룹 Changes 테이블, Mermaid 시퀀스, 테스트 계획 — then runs gh pr create.
allowed-tools: Bash(git:*), Bash(gh:*), Read, Grep
---

# PR 생성 스킬

이 스킬은 슬래시 커맨드 `/pr` 과 동일한 절차를 따릅니다.

**진실 원천:** [`.claude/commands/pr.md`](../../commands/pr.md)

## 절차

### STEP 0: 코드 리뷰 + QA (PR 생성 전 필수)

PR을 생성하기 전에 **반드시** 아래 두 단계를 순서대로 실행한다.

#### 0-1. 코드 리뷰

`git diff <target-branch>...HEAD --name-only` 로 변경 파일 목록을 수집한 뒤, 아래 항목을 검사한다:

1. **디자인 시스템 위반** — `design-system-guard` 스킬의 STEP 2~4 절차를 따른다.
   - 변경된 스타일 파일(`.styles.ts`, `.css`)과 컴포넌트 파일을 대상으로 실행.
   - 위반이 발견되면 즉시 수정하고 `fix(review): <설명>` 커밋.
2. **타입/빌드 검사** — `pnpm tsc --noEmit` 실행. 에러 있으면 수정 후 커밋.
3. **린트 검사** — `pnpm lint` 실행. 자동 수정 가능한 항목은 `pnpm lint:fix` 후 커밋.

> 위반/에러가 없으면 "코드 리뷰 통과" 보고 후 0-2로 진행.

#### 0-2. QA

`/qa` 스킬을 호출해 변경된 페이지·기능을 브라우저에서 검증한다.

- diff-aware 모드로 변경된 컴포넌트·페이지만 테스트한다.
- 발견된 버그는 즉시 수정하고 `fix(qa): ISSUE-NNN — <설명>` 커밋.
- QA 완료 후 "QA 통과" 보고 후 STEP 1로 진행.

---

### STEP 1~6: PR 생성

1. `.claude/commands/pr.md` 를 **Read** 로 읽는다.
2. 그 안의 STEP 1~6 을 순서대로 그대로 실행한다.
   - 정보 수집(git log/diff) + **포크 감지** → 변경 분석 → 템플릿대로 PR 본문 작성 → 제목 결정 → 푸시 & `gh pr create` → 결과 보고
3. 타겟 브랜치 기본값은 `dev`, draft 키워드 감지 시 `--draft`.
4. PR 생성 전 본문을 사용자에게 보여주고 **승인 후** 진행한다.

## 포크 레포 동작

`upstream` 리모트가 있으면 **자동으로** 포크 경로를 사용한다:

- 푸시 대상: `upstream` (origin 아님)
- PR 생성: `gh pr create --repo <upstream-slug>` → upstream 브랜치 → upstream 타겟 브랜치
- `upstream` 리모트가 없으면 기존 origin 경로로 동작

> 커맨드 본문과 이 스킬이 어긋나면 `.claude/commands/pr.md` 를 우선한다. 절차를 중복 작성하지 말고 항상 그 파일을 읽어 따른다.
