# 프로젝트 스킬 (.claude/skills)

MegaBobs Phase 1 구현을 돕는 프로젝트 레벨 Claude 스킬 모음입니다.
각 스킬은 폴더 하나 + `SKILL.md`(frontmatter `name`/`description` + 본문)로 구성됩니다.
본문은 작업자가 직접 작성합니다 — 이 인덱스는 어떤 스킬이 어디에 들어가는지 알려주는 골격입니다.

## 스킬 목록

| 스킬 | 폴더 | 목적 | 발동 시점 |
|---|---|---|---|
| create-pr | `create-pr/` | diff 분석 → 구조화된 PR 본문(요약·Changes 테이블·Mermaid·테스트 계획) 생성 후 `gh pr create`. 슬래시 커맨드 [`/pr`](../commands/pr.md) 과 동일 절차 | "PR 만들어줘" 등 PR 생성 요청 시 |

## 작성 가이드

`SKILL.md` frontmatter 최소 형식:

```markdown
---
name: <kebab-case 스킬명>
description: <언제 이 스킬을 써야 하는지 한 줄 — 호출 판단에 사용됨>
---

<본문: 따라야 할 규칙·절차>
```

참고 문서: [Phase 1 디자인 문서](../../docs/design/2026-06-05-phase1-design.md) · 컨벤션은 루트 `CLAUDE.md`.
