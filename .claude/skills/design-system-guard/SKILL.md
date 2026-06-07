---
name: design-system-guard
description: UI·스타일 코드 작성 또는 리뷰 시 DESIGN.md 토큰·규칙 위반을 검출하고 수정 제안. 컴포넌트 구현, 스타일 변경, QA 시 발동.
---

# Design System Guard

UI 코드를 작성하거나 리뷰하기 전에 이 절차를 따른다.

## STEP 1: DESIGN.md 로드

`DESIGN.md` (repo root)를 Read로 읽는다. 이미 읽었으면 스킵.

## STEP 2: 금지 패턴 체크

대상 파일에서 아래 패턴을 grep/Read로 확인한다.

### 🚫 절대 금지

| 패턴                                         | 이유                       | 대체                                 |
| -------------------------------------------- | -------------------------- | ------------------------------------ |
| `border` 클래스 (카드 경계)                  | shadow-only elevation 원칙 | `shadow-[var(--shadow-card)]`        |
| `rounded-*` (풀 스퀘어 원칙 위반)            | border-radius: 0 전면      | 물리적 원형 요소만 예외              |
| 하드코딩 컬러 (`#111`, `#fff`, `gray-*` 등)  | 토큰 밖 색상               | `--color-*` 토큰 사용                |
| UI 이모지 (`🍚`, `✅` 등 텍스트에 직접 삽입) | Iconography 규칙           | lucide 아이콘, 넘버링, 타이포 글리프 |
| `dark:*` 클래스                              | 라이트 단일 테마           | 없음                                 |
| `text-red-*`, `text-blue-*` (토큰 미정의)    | 토큰 밖 컬러               | 디자인 토큰으로 흡수 필요            |

### ⚠️ 주의 (맥락 확인 필요)

| 패턴                            | 확인 사항                              |
| ------------------------------- | -------------------------------------- |
| `text-muted`                    | 본문에 쓰면 위반 — 캡션/메타 한정      |
| `text-[*px]` 10px 이하          | 본문 최소 13px, 메타 한정              |
| `text-accent` / `bg-accent`     | 키컬러 남발 금지 — 사용처 6가지만 허용 |
| `border-b`, `border-t` (구분선) | 헤어라인은 `border-line` 토큰만 허용   |

## STEP 3: 접근성 체크

- 인터랙티브 요소에 `aria-label` / `aria-pressed` / `aria-disabled` 누락 여부
- 터치 타깃 44px 미만 여부 (`size-9` = 36px → `size-11` = 44px)
- `focus-visible` 없는 버튼/링크
- 이미지/아이콘 장식 요소에 `aria-hidden` 누락

## STEP 4: 위반 리포트

위반이 있으면 아래 형식으로 보고한다:

```
🚨 디자인 시스템 위반 발견

| 파일:줄 | 패턴 | 위반 유형 | 수정 제안 |
|---|---|---|---|
| SiteHeader.tsx:42 | `border border-line` | 카드 border 금지 | `shadow-[var(--shadow-card)]` |
```

위반이 없으면: "✅ 디자인 시스템 규칙 통과"

## STEP 5: 레이아웃 일관성 체크 (덜컥거림 방지)

### 페이지 간 공통 구조

- 여러 페이지가 동일한 eyebrow → title → description → content 구조를 공유할 때는 반드시 **공통 레이아웃 컴포넌트**로 추출한다.
- 헤더 섹션에 `min-h` 고정값을 부여해 description 유무와 관계없이 콘텐츠 영역 시작 위치를 통일한다.
- 현재 구현: `PageLayout` (`src/components/@shared/layout/PageLayout/`)

### 조건부 렌더링 요소 깜빡임

- `mounted` 플래그 등 CSR에서만 표시되는 요소(투표 버튼, 상태 배지 등)는 마운트 시 `animate-[fadeIn_0.3s_ease_both]` 적용.
- SSR→CSR 전환 중 레이아웃 시프트가 생기는 요소는 `useLayoutEffect`로 페인트 전 초기화.

### 높이 변경 트랜지션

- 콘텐츠 변경으로 컨테이너 높이가 달라지면 Web Animations API로 보간한다.
  ```ts
  el.animate([{ height: `${prev}px` }, { height: `${next}px` }], { duration: 280, easing: 'ease-in-out' });
  ```
- `overflow-hidden`을 함께 적용해 보간 중 콘텐츠 넘침을 방지한다.

### 페이지 진입 애니메이션 금지

- **페이지 로드 시 fadeUp·stagger 입장 애니메이션 금지.** 새로고침마다 콘텐츠가 "부드럽게" 나타나는 효과는 피로감을 준다.
- 허용: 상시 루프 (`softPulse`, `planeFly`, `floatUp`) + 인터랙션 피드백 (`chipPop`, 조건부 `fadeIn`).

## STEP 6: 코드 작성 시 토큰 참조

새 컴포넌트/스타일 작성 시 반드시 아래 토큰 목록에서 선택한다.

**배경:** `bg-bg` · `bg-surface` · `bg-surface-warm` · `bg-board` · `bg-board-2`
**텍스트:** `text-ink` · `text-ink-2` · `text-muted`(캡션한정) · `text-cream` · `text-cream-2` · `text-accent-text`
**액센트:** `bg-accent` · `text-accent` · `bg-accent-soft` · `bg-accent-deep`
**비활성:** `bg-down-soft` · `text-down`
**구분선:** `border-line` (헤어라인 전용)
**그림자:** `shadow-[var(--shadow-flat)]` · `shadow-[var(--shadow-card)]` · `shadow-[var(--shadow-card-hover)]`
**형광펜:** `[background:linear-gradient(transparent_40%,var(--color-highlight)_40%)]`
