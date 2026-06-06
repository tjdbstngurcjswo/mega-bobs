---
name: start-ticket
description: Notion 티켓 조회 → 작업 계획 기입 → 브랜치 생성까지 작업 시작 절차 전체를 처리. "작업 시작", "티켓 따서", "MEGA-XX 작업" 등 티켓 기반 작업 착수 시 발동.
---

# Start Ticket

새 작업을 시작하기 전에 이 절차를 따른다. 브랜치 생성은 반드시 티켓 계획 승인 후에만 진행한다.

## STEP 1: 티켓 식별

사용자 메시지에서 티켓 번호 또는 작업 키워드를 추출한다.

- 번호가 명시된 경우 (`MEGA-50`, `50번` 등): 해당 티켓 직접 조회
- 번호가 없는 경우: Notion 보드에서 `Status = To Do` 또는 `In Progress` 티켓 목록 조회 후 사용자에게 선택 요청

Notion 데이터베이스 ID: `377cb4f8-4b7f-8012-ad8c-ca1ca0bfad59`

```
mcp__notion-local__API-query-data-source 로 database_id 조회
→ filter: { property: "Status", status: { equals: "To Do" } }
→ 우선순위(P0 > P1 > P2 > P3) 순으로 정렬해서 목록 제시
```

## STEP 2: 티켓 내용 파악

해당 티켓 페이지를 `mcp__notion-local__API-retrieve-a-page` 로 조회해 아래 항목을 파악한다:

- 제목 (티켓 번호 포함)
- 현재 설명/요구사항
- 우선순위, 예상 소요 시간
- 관련 컴포넌트·파일 (기재된 경우)

## STEP 3: 작업 계획 초안 작성

파악한 티켓 내용을 바탕으로 아래 구조의 작업 계획을 초안한다.

```markdown
## 작업 계획

### 목표
[한 줄 — 이 작업이 완료되면 무엇이 달라지는가]

### 구현 범위
- [ ] 항목 1 (파일명 명시)
- [ ] 항목 2
- ...

### 영향 파일
| 파일 | 변경 유형 | 비고 |
|---|---|---|
| src/... | 신규/수정/삭제 | |

### 기술 결정
- 방식: ...
- 사용 라이브러리: ...
- 주의사항: ...

### 완료 기준 (Definition of Done)
- [ ] 기능 동작 확인
- [ ] 디자인 시스템 위반 없음
- [ ] 타입 에러 없음 (`pnpm build` 통과)
- [ ] lint/format 통과
```

## STEP 4: 티켓에 계획 기입 + 상태 업데이트

작업 계획 초안을 사용자에게 보여주고 **승인 후** 아래를 실행한다.

1. `mcp__notion-local__API-patch-block-children` 으로 티켓 페이지 본문에 계획 추가
2. `mcp__notion-local__API-patch-page` 으로 Status → `In Progress` 변경

승인 없이 Notion 업데이트 금지.

## STEP 5: 브랜치 생성

티켓 계획이 승인되고 Notion 업데이트가 완료된 후에만 실행한다.

### 브랜치명 규칙

| 티켓 유형 | 접두사 | 예시 |
|---|---|---|
| 신규 기능 | `feat/` | `feat/MEGA-50-notice-board` |
| 버그 수정 | `fix/` | `fix/MEGA-61-menu-date-overflow` |
| 리팩터링 | `refactor/` | `refactor/MEGA-72-hero-status` |
| 문서/설정 | `chore/` | `chore/MEGA-80-env-cleanup` |

- 슬러그: `MEGA-{번호}-{제목-kebab-case}` (영문, 최대 40자)
- 기준 브랜치: **반드시 `dev`**

```bash
git fetch upstream
git checkout dev
git merge upstream/dev
git checkout -b feat/MEGA-{번호}-{슬러그}
```

## STEP 6: 완료 보고

```
✅ 작업 준비 완료

- 티켓: MEGA-{번호} — {제목}
- 브랜치: feat/MEGA-{번호}-{슬러그} (dev 기준)
- Notion: 작업 계획 기입 + In Progress 전환 완료

다음 단계: 구현 시작 (component-scaffold / design-system-guard 스킬 참조)
```
