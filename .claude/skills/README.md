# 프로젝트 스킬 (.claude/skills)

MegaBobs Phase 1 구현을 돕는 프로젝트 레벨 Claude 스킬 모음입니다.
각 스킬은 폴더 하나 + `SKILL.md`(frontmatter `name`/`description` + 본문)로 구성됩니다.
본문은 작업자가 직접 작성합니다 — 이 인덱스는 어떤 스킬이 어디에 들어가는지 알려주는 골격입니다.

## 스킬 목록

| 스킬 | 폴더 | 목적 | 발동 시점 |
|---|---|---|---|
| `create-pr` | `create-pr/` | diff 분석 → 구조화된 PR 본문(요약·Changes 테이블·Mermaid·테스트 계획) 생성 후 `gh pr create`. 슬래시 커맨드 [`/pr`](../commands/pr.md) 과 동일 절차 | "PR 만들어줘" 등 PR 생성 요청 시 |
| `design-system-guard` | `design-system-guard/` | DESIGN.md 토큰·규칙 위반(border, rounded, 하드코딩 컬러, 이모지 등) 검출 및 수정 제안, 접근성 체크 | 컴포넌트·스타일 작성/리뷰 시 |
| `component-scaffold` | `component-scaffold/` | 프로젝트 컨벤션(arrow fn, 네이밍, import 순서, 300/80줄 제한)에 맞춰 새 컴포넌트·페이지·훅 생성 | 새 컴포넌트/페이지/훅 추가 시 |
| `api-route-pattern` | `api-route-pattern/` | Next.js Route Handler + Supabase + 인증/캐시 패턴으로 새 API 엔드포인트 생성 | `src/app/api/*` 추가 시 |
| `supabase-schema` | `supabase-schema/` | 테이블 SQL·RLS 정책·TypeScript 타입·쿼리 함수를 일관되게 작성 | 새 테이블/스키마 변경 시 |
| `start-ticket` | `start-ticket/` | Notion 티켓 조회 → 작업 계획 기입 → dev 기준 브랜치 생성까지 작업 착수 절차 전체 처리 | "작업 시작", "MEGA-XX 시작", 티켓 기반 작업 착수 시 |
| `readme-sync` | `readme-sync/` | diff 분석 → README.md 누락 항목 확인 → 필요 시 수정·커밋. `create-pr` STEP 0으로 자동 실행 | PR 생성 전 자동 호출 (직접 호출도 가능) |

## 작성 가이드

`SKILL.md` frontmatter 최소 형식:

```markdown
---
name: <kebab-case 스킬명>
description: <언제 이 스킬을 써야 하는지 한 줄 — 호출 판단에 사용됨>
---

<본문: 따라야 할 규칙·절차>
```

참고 문서: 컨벤션은 루트 `CLAUDE.md`.
