# 프로젝트 스킬 (.claude/skills)

MegaBobs Phase 1 구현을 돕는 프로젝트 레벨 Claude 스킬 모음입니다.
각 스킬은 폴더 하나 + `SKILL.md`(frontmatter `name`/`description` + 본문)로 구성됩니다.
본문은 작업자가 직접 작성합니다 — 이 인덱스는 어떤 스킬이 어디에 들어가는지 알려주는 골격입니다.

## 스킬 목록

| 스킬 | 폴더 | 목적 | 발동 시점 |
|---|---|---|---|
| `create-pr` | `create-pr/` | diff 분석 → 구조화된 PR 본문(요약·Changes 테이블·Mermaid·테스트 계획) 생성 후 `gh pr create` | "PR 만들어줘" 등 PR 생성 요청 시 |
| `design-system-guard` | `design-system-guard/` | DESIGN.md 토큰·규칙 위반(border, rounded, 하드코딩 컬러, 이모지 등) 검출 및 수정 제안, 접근성 체크 | 컴포넌트·스타일 작성/리뷰 시 |
| `component-scaffold` | `component-scaffold/` | 프로젝트 컨벤션(arrow fn, 네이밍, import 순서, 300/80줄 제한)에 맞춰 새 컴포넌트·페이지·훅 생성 | 새 컴포넌트/페이지/훅 추가 시 |
| `api-route-pattern` | `api-route-pattern/` | Next.js Route Handler + Supabase + 인증/캐시 패턴으로 새 API 엔드포인트 생성 | `src/app/api/*` 추가 시 |
| `supabase-schema` | `supabase-schema/` | 테이블 SQL·RLS 정책·TypeScript 타입·쿼리 함수를 일관되게 작성 | 새 테이블/스키마 변경 시 |

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
