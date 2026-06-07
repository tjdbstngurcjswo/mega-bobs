# Design System — MegaBobs

> 단일 진실 소스(SSOT). 모든 시각/UI 결정은 이 문서를 따른다.
> 토큰 구현 기준은 [`src/app/globals.css`](src/app/globals.css)의 `@theme` 블록.

## Product Context

- **무엇인가:** 메가존 임직원용 구내식당 메뉴 뷰어 — 날짜·코스별 식단 조회, 실시간 운영 상태 표시, Slack 봇 연동.
- **누구를 위한가:** 과천 지식정보타운 메가존 직원. 점심 직전 "오늘 뭐 먹지"를 30초 안에 해결하려는 사람.
- **공간/업종:** 사내 유틸리티. 식단표(메뉴판)가 1차 정체성.
- **프로젝트 타입:** 모바일 우선 반응형 웹앱(App UI). 마케팅 사이트 아님.
- **기억에 남길 한 가지:** 토스 느낌의 쿨 팔레트 — near-black + clean white + cool blue-tint, 경계선 없는 shadow-only 카드.

## Aesthetic Direction

- **방향:** 쿨 블루틴트 배경 + near-black 잉크 + shadow-only elevation. 경계선 없음.
- **데코레이션 레벨:** minimal — 타이포와 여백이 일한다. 그림자로 깊이 표현. 장식 블롭·그라데이션 데코 금지.
- **무드:** 전문적이고 깔끔한 쿨 팔레트에 옐로우 키컬러 한 점. 진지하지만 친근한 사내 도구.
- **헤더:** 스크롤 전 투명 → 스크롤 후 `bg-white/70 backdrop-blur-xl` frosted glass 고정.

## Shape (핵심 규칙)

- **풀 스퀘어 — `border-radius: 0` 전면.** pill·둥근 카드 금지.
- 예외: 물리적 원형 요소만(슬롯 노브, 풍선, 토글 반원, 공지 NEW 닷).
- 토큰: `--radius-none: 0`.

## Typography

- **단일 서체: Pretendard (가변, self-host).** 세리프 미사용. 위계는 weight(800~900) + letter-spacing으로만.
  - self-host: [`src/app/layout.tsx`](src/app/layout.tsx), `display: swap`, weight `45 920`, `--font-pretendard`.
  - 폴백: `-apple-system, sans-serif`.
- **역할별:** 디스플레이/헤딩 800~900 + tracking -0.02~-0.035em · 본문 600 · 메타/캡션 muted.
- **스케일(px):** 11.5 / 12 / 13 / 13.5 / 14 / 15 / 17 / 19 / 22 / 26 / 27 / 30 / 32.
- **본문 최소 크기:** 본문·설명 텍스트는 13px 이상 권장. 10.5px 이하 캡션은 메타 정보 한정(장식적 사용 금지).
- **한글:** `word-break: keep-all` (단어 중간 줄바꿈 방지).

## Color

- **전략:** 뉴트럴 모노 베이스 + **저채도 옐로우 단일 키컬러**. 이색(오렌지/그린/블루) 금지.
- **키컬러 사용처 한정:** CTA, 투표/픽, 헤드라인 형광펜, 넘버링, 활성 탭 밑줄. 그 외 남발 금지.
- **규칙 1:** 옐로우 배경 위 텍스트는 **잉크(#111)**, 화이트 금지.
- **규칙 2:** 라이트 배경 위 옐로우 텍스트는 `--accent-text #997400` 사용(대비 확보용).

| 토큰 | Hex | 용도 |
|---|---|---|
| `--color-bg` | `#f3f6fb` | 페이지 배경 (cool blue-tint) |
| `--color-surface` | `#ffffff` | 카드 배경 |
| `--color-surface-warm` | `#eaf0f8` | 섹션 구분용 cool tint |
| `--color-board` / `--color-board-2` | `#111720` / `#1a2333` | 다크 카드 (cool deep navy-black) / 활성 탭 면 |
| `--color-ink` / `--color-ink-2` | `#111720` / `#455060` | 본문 / 보조 텍스트 (cool) |
| `--color-muted` | `#7e8fa0` | 캡션/메타 **한정** (본문 대비 미달 — 본문 사용 금지) |
| `--color-line` | `#d8e0ea` | 헤어라인 (cool blue-grey) |
| `--color-cream` / `--color-cream-2` | `#dde5f0` / `#8fa4bc` | 다크 위 텍스트 / 다크 위 보조 |
| `--color-accent` | `#e2c04c` | 키컬러 (유일한 액센트) |
| `--color-accent-deep` | `#c2a02e` | 키컬러 딥 |
| `--color-accent-soft` | `#faf3d6` | 키컬러 연한 면 |
| `--color-accent-text` | `#836000` | 라이트 위 옐로우 텍스트 |
| `--color-highlight` | `#eedfa0` | 헤드라인 형광펜 (코스 카테고리 레이블) |
| `--color-down` / `--color-down-soft` | `#6e8094` / `#e4eaf3` | 비활성/보조 버튼 그레이 |

- **테마: 라이트 단일 확정.** 다크모드 없음(`next-themes` 미사용).
- **하드코딩 금지:** 토큰 밖 그레이(`#B5B5B2` 등)는 토큰으로 흡수할 것.

## Spacing & Layout

- **base unit:** 4px 계열. 밀도: comfortable(식단은 dense-but-readable).
- **콘텐츠 컨테이너:** `min(880px, calc(100% - 40px))` (좌우 20px 거터 고정).
- **홈 그리드:** 데스크톱 `1fr 300px` gap 24 → 920px 미만 1컬럼 스택.
- **헤딩 반응형:** 히어로 22px → 640px 미만 18px.
- **최소 뷰포트:** `min-width: 360px`. 360px 미만에서는 `transform: scale(100vw / 360px)` 비율 유지 축소.
- **그림자 (elevation — border 대체):**
  - `--shadow-flat: 0 1px 2px rgba(0,0,0,.05)` — 미세 구분
  - `--shadow-card: 0 1px 3px rgba(0,0,0,.06), 0 4px 20px rgba(0,0,0,.05)` — 카드 기본
  - `--shadow-card-hover: 0 2px 6px rgba(0,0,0,.08), 0 8px 28px rgba(0,0,0,.07)` — 카드 호버
- **border 사용 금지:** 카드 경계는 그림자로만 표현. `border` 클래스 추가 전 DESIGN.md 확인 필수.

## Motion

- **방향:** minimal-functional — 이해를 돕는 전환만.
- **구현된 키프레임** (`src/app/globals.css`):
  - `fadeUp` — `opacity: 0 + translateY(6px)` → 정상. 0.28s ease. CourseRow 스태거(`animationDelay: index * 70ms`), HeroStatus 아이콘/텍스트.
  - `fadeIn` — opacity만. 0.3s ease.
  - `softPulse` — opacity 1↔0.55 반복 (2.4s). HeroStatus 운영 중 `Utensils` 아이콘.
- **스태거 패턴:** `index * 70ms` delay — 목록 항목이 순차 등장하는 효과.
- `prefers-reduced-motion` 대응 필요 (미구현 — 향후 추가).

## Iconography

- **UI 이모지 전면 금지.** 대체: 넘버링(01–04), 이니셜 아바타, 타이포 글리프, CSS 도형(토글 반원), 라인 아이콘(lucide).
- 로고: 옐로우 사각 + 워드마크(현재 워드마크 텍스트만 구현).

## Accessibility (규칙 — QA 시 위반 플래그)

- **대비:** 본문 텍스트 ≥ 4.5:1. `ink #111 on bg #F5F5F3 ≈ 17:1` OK. `muted #8A8A8A`는 캡션 한정(본문 대비 미달). 라이트 위 옐로우는 `#997400`.
- **터치 타깃:** 모바일 인터랙티브 요소 ≥ 44px.
- **포커스:** 키보드 내비 가능 + 보이는 `focus-visible` 링 제공. 슬롯 등 게임은 스페이스바 지원.
- **상태 표시:** `aria-pressed`/`aria-disabled`/`aria-label`/`aria-hidden`(장식) 일관 적용.

### 현재 알려진 위반 (수정 대상)

없음.
