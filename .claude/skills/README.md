# 프로젝트 스킬 (.claude/skills)

MegaBobs 구현을 돕는 프로젝트 레벨 Claude 스킬 모음. 각 스킬은 폴더 + `SKILL.md`로 구성.

## 스킬 목록

| 스킬                  | 발동 시점                                            |
| --------------------- | ---------------------------------------------------- |
| `create-pr`           | "PR 만들어줘" 등 PR 생성 요청 시                     |
| `design-system-guard` | 컴포넌트·스타일 작성/리뷰 시                         |
| `component-scaffold`  | 새 컴포넌트/페이지/훅 추가 시                        |
| `lean-component`      | 컴포넌트 파일 작성·수정 시 항상                      |
| `api-route-pattern`   | `src/app/api/*` 추가 시                              |
| `supabase-schema`     | 새 테이블/스키마 변경 시                             |
| `start-ticket`        | "작업 시작", "MEGA-XX 시작" 등 티켓 기반 작업 착수 시 |
| `readme-sync`         | README.md 최신화 확인 시 (`/readme-sync`)            |
| `ux-writing`          | 한국어 UI 문구 작성·검수 시                          |

## 작성 가이드

```markdown
---
name: <kebab-case 스킬명>
description: <언제 이 스킬을 써야 하는지 한 줄>
---

<본문: 따라야 할 규칙·절차>
```

컨벤션은 루트 `CLAUDE.md` 참조.
