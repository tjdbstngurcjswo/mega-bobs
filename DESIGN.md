# Design System — MegaBobs

> 단일 진실 소스(SSOT). 모든 시각/UI 결정은 이 문서를 따른다.
> 토큰 구현 기준은 [`src/app/globals.css`](src/app/globals.css)의 `@theme` 블록.
> 화면별 상세 스펙·엣지케이스는 [`docs/design/2026-06-05-phase1-design.md`](docs/design/2026-06-05-phase1-design.md) 참조.

## Product Context

- **무엇인가:** 메가존 임직원용 구내식당 점심 허브 — 날짜·코스별 식단 조회, (예정) 투표·내기 게임·지정타 맛집.
- **누구를 위한가:** 과천 지식정보타운 메가존 직원. 점심 직전 "오늘 뭐 먹지"를 30초 안에 해결하려는 사람.
- **공간/업종:** 사내 유틸리티 + 점심 커뮤니티. 식단표(메뉴판)가 1차 정체성.
- **프로젝트 타입:** 모바일 우선 반응형 웹앱(App UI). 마케팅 사이트 아님.
- **기억에 남길 한 가지:** "각진 메뉴판" — 둥근 SaaS 카드가 아니라, 옐로우 키컬러 한 점이 박힌 흑백 에디토리얼 식단표.

## Aesthetic Direction

- **방향:** 비스트로 테라코타 / 에디토리얼 — 푸드 웜톤 리브랜딩(기존 블루 폐기). 메뉴판 무드, 식단 스캔 속도 우선.
- **데코레이션 레벨:** minimal — 타이포와 여백이 일한다. 그림자는 헤어라인 + 미세 섀도뿐. 장식 블롭·그라데이션 데코 금지.
- **무드:** 차분한 흑백 베이스에 옐로우 한 점. 진지하지만 친근한 사내 도구.
- **레퍼런스:** Figma `Db40M9n99faf18mk211nM4`, `docs/design/mockups`.

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
| `--color-bg` | `#F5F5F3` | 페이지 배경 |
| `--color-surface` | `#FFFFFF` | 카드 |
| `--color-surface-warm` | `#F7F7F5` | 따뜻한 면 |
| `--color-board` / `--color-board-2` | `#111111` / `#242424` | 잉크 밴드(헤더/풋터/다크) / 활성 탭 면 |
| `--color-ink` / `--color-ink-2` | `#111111` / `#454545` | 본문 / 보조 텍스트 |
| `--color-muted` | `#8A8A8A` | 캡션/메타 **한정** (본문 대비 미달 — 본문 사용 금지) |
| `--color-line` | `#E3E3E0` | 헤어라인 보더 |
| `--color-cream` / `--color-cream-2` | `#F5F5F3` / `#9A9A9A` | 다크 위 텍스트 / 다크 위 보조 |
| `--color-accent` | `#E2C04C` | 키컬러 (유일한 액센트) |
| `--color-accent-deep` | `#C2A02E` | 키컬러 딥 |
| `--color-accent-soft` | `#FAF4D9` | 키컬러 연한 면 |
| `--color-accent-text` | `#997400` | 라이트 위 옐로우 텍스트 |
| `--color-highlight` | `#F0E0A0` | 헤드라인 형광펜 |
| `--color-down` / `--color-down-soft` | `#767676` / `#F1F1EF` | '별로다' 그레이 |

- **테마: 라이트 단일 확정.** 다크모드 토글 제거(`next-themes` 미사용).
- **하드코딩 금지:** `#C9C9C6`, `#B5B5B2` 등 토큰 밖 그레이는 토큰으로 흡수할 것.

## Spacing & Layout

- **base unit:** 4px 계열. 밀도: comfortable(식단은 dense-but-readable).
- **콘텐츠 컨테이너:** `min(880px, calc(100% - 40px))` (좌우 20px 거터 고정).
- **홈 그리드:** 데스크톱 `1fr 300px` gap 24 → 920px 미만 1컬럼 스택. 우측 컬럼은 보드 높이에 stretch.
- **헤딩 반응형:** 히어로 27px → 560px 미만 22px.
- **그림자:** `--shadow-flat: 0 1px 2px rgba(0,0,0,.05)` 하나만.

## Motion

- **방향:** minimal-functional — 이해를 돕는 전환만. 식단/사이트 크롬은 정적.
- 예외: 게임 3종(사다리/슬롯/풍선)은 expressive 연출 허용(결과 선계산, 연출만 재생). 상세는 디자인 문서 §모션 스펙.
- `prefers-reduced-motion` 시 결과 즉시 표시.

## Iconography

- **UI 이모지 전면 금지.** 대체: 넘버링(01–04), 이니셜 아바타, 타이포 글리프, CSS 도형(토글 반원), 라인 아이콘(lucide).
- 로고: 옐로우 사각 + 워드마크(현재 워드마크 텍스트만 구현).

## Accessibility (규칙 — QA 시 위반 플래그)

- **대비:** 본문 텍스트 ≥ 4.5:1. `ink #111 on bg #F5F5F3 ≈ 17:1` OK. `muted #8A8A8A`는 캡션 한정(본문 대비 미달). 라이트 위 옐로우는 `#997400`.
- **터치 타깃:** 모바일 인터랙티브 요소 ≥ 44px.
- **포커스:** 키보드 내비 가능 + 보이는 `focus-visible` 링 제공. 슬롯 등 게임은 스페이스바 지원.
- **상태 표시:** `aria-pressed`/`aria-disabled`/`aria-label`/`aria-hidden`(장식) 일관 적용.

### 현재 알려진 위반 (수정 대상)

| 항목 | 위치 | 비고 |
|---|---|---|
| © `#6E6E6E` on `#111` ≈ 3.7:1 (미달) | [SiteFooter.tsx:15](src/components/site/SiteFooter.tsx#L15) | `--color-cream-2`(#9A9A9A, ~6.7:1)로 교체 |
| `muted #8A8A8A` 본문 사용 ~3.5:1 | CourseRow, BoardEmpty, HomeSide | 본문은 `ink-2`, 메타만 muted |
| 10.5px 이하 초소형 본문 | [HomeSide.tsx:47](src/components/home/HomeSide.tsx#L47) 등 | 본문 13px↑, 메타 한정 |
| 터치 타깃 <44px (종 36px, 데이 칩) | SiteHeader, DayBar | 모바일에서 44px 확보 |
| 명시적 `focus-visible` 없음 | 전역 | 키컬러 아웃라인 링 추가 |
| 하드코딩 그레이 `#C9C9C6`/`#B5B5B2` | CourseRow:34, DayBar | 토큰화 |

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-06-05 | 비스트로 테라코타(B안) + 풀 스퀘어 + 옐로우 단일 키컬러 + Pretendard 단일 + 라이트 단일 | `docs/design/2026-06-05-phase1-design.md` (D2/D3/D5) |
| 2026-06-05 | DESIGN.md를 SSOT로 신설(/design-consultation) | 기존 phase1 디자인 문서 + globals.css 토큰 정리, a11y 규칙 명문화 |
