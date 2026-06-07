---
description: "[데드코드 제거] knip으로 미사용 파일·export·의존성을 탐지하고 안전하게 제거"
allowed-tools: Bash(npx knip*), Bash(node:*), Bash(rm:*), Bash(rmdir:*), Read, Edit, Bash(find:*), Bash(grep:*)
---

# 데드코드 제거 커맨드

미사용 코드를 탐지하고 제거한다. **삭제 전 항목을 보고하고 확인을 받는다.**

## STEP 1: 탐지

아래 두 명령을 **병렬**로 실행한다:

```bash
# 1. knip — 미사용 파일·export·의존성 탐지
npx knip --reporter compact 2>&1

# 2. 빈 디렉토리 탐지
find src -type d -empty 2>/dev/null
```

## STEP 2: 결과 분류

탐지 결과를 아래 4가지로 분류한다:

| 카테고리 | 설명 | 처리 방침 |
|---|---|---|
| **미사용 파일** | import 되지 않는 파일 전체 | 삭제 |
| **미사용 export** | export는 됐지만 외부에서 import되지 않는 심볼 | barrel에서 export 라인 제거 |
| **미사용 의존성** | package.json에 있으나 코드에서 쓰이지 않는 패키지 | `pnpm remove`로 제거 |
| **빈 디렉토리** | 파일이 없는 디렉토리 | 삭제 |

**False positive 판단 기준:**
- knip이 `server-only`, `@vercel/analytics` 등 런타임 사이드이펙트 패키지를 미사용으로 표시하면 → 무시
- `vitest.config.ts`가 삭제된 테스트 파일을 참조하는 경우 → `vitest.config.ts` 자체 삭제 검토
- Next.js App Router `page.tsx` / `layout.tsx` / `route.ts`는 진입점이므로 knip이 미사용으로 표시해도 → 무시
- Vercel Cron 대상 route(`/api/slack/warm`, `/api/votes/cleanup`)는 직접 import 없어도 유지

## STEP 3: 제거 계획 보고

삭제·수정할 목록을 아래 형식으로 출력하고 **사용자 확인을 받는다**:

```
🗑️ 데드코드 제거 계획

[미사용 파일]
- src/...

[barrel에서 제거할 export]
- src/components/board/index.ts: CourseRow, DayBar

[빈 디렉토리]
- src/...

[의존성 알림 — 자동 삭제 안 함]
- package: reason

총 N개 파일·심볼을 제거합니다. 진행할까요?
```

## STEP 4: 제거 실행

사용자가 확인하면 순서대로 실행한다:

1. **미사용 파일 삭제**: `rm` 으로 각 파일 제거
2. **barrel export 정리**: Edit 도구로 해당 라인만 제거 (파일 자체는 유지)
3. **빈 디렉토리 삭제**: `find src -type d -empty -delete`
4. **재탐지**: `npx knip --reporter compact` 로 잔여 항목 없는지 확인

## STEP 5: 타입 검사

```bash
pnpm tsc --noEmit
```

타입 에러가 발생하면 원인 파악 후 수정한다.

## STEP 6: 결과 보고

```
✅ 데드코드 제거 완료

- 삭제된 파일: N개
- 정리된 export: N개
- 삭제된 디렉토리: N개
- 남은 항목 (의존성 알림): ...
```
