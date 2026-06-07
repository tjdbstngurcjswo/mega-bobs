---
name: create-pr
description: Use when the user asks to create a GitHub PR (PR 만들어줘/올려줘, "PR 생성", draft PR) for the current branch. Analyzes the diff and generates a structured PR body — Walkthrough 요약, 파일 그룹 Changes 테이블, Mermaid 시퀀스, 테스트 계획 — then runs gh pr create.
allowed-tools: Bash(git:*), Bash(gh:*), Read, Grep
---

# PR 생성 스킬

이 스킬은 슬래시 커맨드 `/pr` 과 동일한 절차를 따릅니다.

**진실 원천:** [`.claude/commands/pr.md`](../../commands/pr.md)

## 절차

PR 생성은 아래 순서대로 진행한다. 각 단계를 건너뛰지 않는다.

### STEP 1: 코드 리뷰

`git diff <target-branch>...HEAD --name-only` 로 변경 파일 목록을 수집한 뒤, 아래 항목을 검사한다:

1. **디자인 시스템 위반** — 변경된 `.styles.ts`·컴포넌트 파일에서 `design-system-guard` STEP 2~4 를 따른다.
   - 위반 발견 시 즉시 수정 후 `fix(review): <설명>` 커밋.
2. **타입 검사** — `pnpm tsc --noEmit`. 에러 있으면 수정 후 커밋.
3. **린트 검사** — `pnpm lint`. 자동 수정 가능하면 `pnpm lint:fix` 후 커밋.

위반·에러 없으면 "✅ 코드 리뷰 통과" 보고 후 STEP 2 진행.

### STEP 2: QA

`/qa` 스킬을 호출해 변경된 페이지·기능을 브라우저에서 검증한다.

- diff-aware 모드로 변경된 컴포넌트·페이지만 테스트한다.
- 발견된 버그는 즉시 수정 후 `fix(qa): ISSUE-NNN — <설명>` 커밋.
- QA 완료 후 "✅ QA 통과" 보고 후 STEP 3 진행.

### STEP 3: 사전 정리 (`.claude/commands/pr.md` STEP 0)

`.claude/commands/pr.md` 를 **Read** 로 읽은 뒤 STEP 0 을 실행한다.

- 0-1: 데드코드 제거
- 0-2: README 최신화 확인

### STEP 4: PR 생성 (`.claude/commands/pr.md` STEP 1~6)

`pr.md` 의 STEP 1~6 을 순서대로 실행한다.

- 정보 수집(git log/diff) + **포크 감지** → 변경 분석 → 템플릿대로 PR 본문 작성 → 제목 결정 → 푸시 & `gh pr create` → 결과 보고
- 타겟 브랜치 기본값: `dev`. draft 키워드 감지 시 `--draft`.
- **PR 생성 전 본문을 사용자에게 보여주고 승인 후 진행한다.**

## 포크 레포 동작

`upstream` 리모트가 있으면 **자동으로** 포크 경로를 사용한다:

- 푸시 대상: `upstream` (origin 아님)
- PR 생성: `gh pr create --repo <upstream-slug>` → upstream 브랜치 → upstream 타겟 브랜치
- `upstream` 리모트가 없으면 기존 origin 경로로 동작

> 커맨드 본문과 이 스킬이 어긋나면 `.claude/commands/pr.md` 를 우선한다.
