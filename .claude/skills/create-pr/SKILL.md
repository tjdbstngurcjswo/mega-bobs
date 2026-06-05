---
name: create-pr
description: Use when the user asks to create a GitHub PR (PR 만들어줘/올려줘, "PR 생성", draft PR) for the current branch. Analyzes the diff and generates a structured PR body — Walkthrough 요약, 파일 그룹 Changes 테이블, Mermaid 시퀀스, 테스트 계획 — then runs gh pr create.
allowed-tools: Bash(git:*), Bash(gh:*), Read, Grep
---

# PR 생성 스킬

이 스킬은 슬래시 커맨드 `/pr` 과 동일한 절차를 따릅니다.

**진실 원천:** [`.claude/commands/pr.md`](../../commands/pr.md)

## 절차

1. `.claude/commands/pr.md` 를 **Read** 로 읽는다.
2. 그 안의 STEP 1~6 을 순서대로 그대로 실행한다.
   - 정보 수집(git log/diff) → 변경 분석 → 템플릿대로 PR 본문 작성 → 제목 결정 → 푸시 & `gh pr create` → 결과 보고
3. 타겟 브랜치 기본값은 `dev`, draft 키워드 감지 시 `--draft`.
4. PR 생성 전 본문을 사용자에게 보여주고 **승인 후** 진행한다.

> 커맨드 본문과 이 스킬이 어긋나면 `.claude/commands/pr.md` 를 우선한다. 절차를 중복 작성하지 말고 항상 그 파일을 읽어 따른다.
