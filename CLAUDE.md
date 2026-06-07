# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MegaBobs는 메가존 임직원용 구내식당 메뉴 뷰어입니다. 날짜·코스별 식단 조회, 실시간 운영 상태 표시, Slack 봇 연동, MCP 서버를 제공합니다.
Next.js 15 (App Router) + Supabase PostgreSQL, Vercel 배포.

## Commands

```bash
pnpm dev            # Dev server (Turbopack)
pnpm build          # Production build
pnpm start          # Production server
pnpm lint           # ESLint 검사
pnpm lint:fix       # ESLint 자동 수정
pnpm format         # Prettier 포맷
pnpm format:check   # Prettier 검사
pnpm test           # Vitest 단위 테스트
pnpm test:watch     # Vitest watch 모드
pnpm mcp            # MCP 서버 실행 (src/mcp/index.ts)
```

## Architecture

### Data Flow

```
Supabase daily_menu
  → page.tsx (Server Component, ISR 6h revalidation)
  → MenuBoard (Client Component)
  → useDateStore (Zustand)
  → DayBar / CourseRow
```

### Key Directories

```
src/
├── api/
│   ├── getMenu.ts        # Supabase daily_menu 조회 함수
│   └── getAnnouncements.ts # env 필터링 공지 조회 함수
├── models/
│   ├── menu.ts           # MenuType, MenuCategory, MealType, MenuItemType
│   ├── notice.ts         # Notice
│   └── vote.ts           # VoteType, VoteResult, PickType, PickResult
├── app/
│   ├── api/
│   │   ├── menu/         # GET ?start=&end= — 날짜 범위 메뉴 조회
│   │   ├── mcp/          # MCP Streamable HTTP 엔드포인트
│   │   ├── picks/        # GET/POST — 식전 코스 픽 (menu_picks)
│   │   ├── slack/        # POST — 슬래시 커맨드 핸들러
│   │   │   └── warm/     # GET — Cron 캐시 워밍 (매일 15:00 UTC)
│   │   ├── votes/        # GET/POST — 코스별 맛 평가 투표 (menu_votes)
│   │   │   └── cleanup/  # DELETE — 만료 투표 데이터 정리
│   │   └── revalidate/   # GET ?secret= — ISR 강제 재검증 (매일 19:30 UTC)
│   ├── notice/           # 공지사항 페이지
│   ├── globals.css       # @theme 토큰 (Tailwind v4)
│   ├── layout.tsx        # Pretendard 폰트 셀프호스팅, @vercel/analytics
│   └── page.tsx          # 홈 (ISR, HeroStatus 렌더)
├── assets/
│   └── fonts/            # Pretendard 셀프호스팅 폰트
├── components/
│   ├── @shared/          # ErrorBoundary, SiteHeader, SiteFooter + index.ts
│   ├── menu/             # MenuBoard (_BoardEmpty, _CourseRow, _DayBar)
│   └── home/             # HeroStatus, HeroDate, HomeSide
├── constants/
│   ├── cafeteria.ts      # CAFETERIA 운영 시각 config (단일 소스)
│   ├── menu.ts           # MenuCategoryLabel (코스 카테고리 한글 레이블)
│   ├── site.ts           # NAV_ITEMS, HOME_ENTRIES, FOOTER_LINKS
│   └── slack.ts          # Slack 커맨드 맵
├── data/
│   └── announcements.ts  # 정적 공지 데이터 (TS 배열)
├── hooks/
│   ├── useHasMounted.ts  # SSR/CSR 하이드레이션 불일치 방지 훅
│   ├── usePick.ts        # 식전 코스 픽 클라이언트 훅
│   └── useVote.ts        # 맛 평가 투표 클라이언트 훅
├── lib/
│   ├── dayjs.ts          # Asia/Seoul 타임존 설정 — 항상 여기서 import
│   └── supabaseServer.ts
├── mcp/
│   ├── index.ts          # MCP 서버 진입점 (stdio transport)
│   └── server.ts         # MCP 도구 정의
├── store/
│   └── useDateStore.ts   # today, selectedDate, currentWeek, 주 이동
└── utils/
    ├── cn.ts             # cn() 클래스 병합 유틸
    ├── date.ts           # formatYYYYMMDD(), getWeekDays()
    ├── menuPolicy.ts     # 운영 시각 판별 함수 (isAfterClose 등)
    └── voterId.ts        # 익명 투표자 ID 생성·관리 (localStorage)
```

### API Routes

| 경로                 | 메서드   | 인증         | 용도                                   |
| -------------------- | -------- | ------------ | -------------------------------------- |
| `/api/menu`          | GET      | `x-api-key`  | `?start=&end=` 날짜 범위 메뉴 조회     |
| `/api/slack`         | POST     | —            | 슬래시 커맨드 (오늘/내일/모레/글피)    |
| `/api/slack/warm`    | GET      | —            | Cron 캐시 워밍 (vercel.json 15:00 UTC) |
| `/api/revalidate`    | GET      | `?secret=`   | ISR 강제 재검증                        |
| `/api/mcp`           | GET/POST | —            | MCP Streamable HTTP                    |
| `/api/votes`         | GET/POST | `x-voter-id` | 코스별 맛 평가 투표 조회·제출          |
| `/api/votes/cleanup` | DELETE   | Bearer       | 만료 투표 데이터 정리                  |
| `/api/picks`         | GET/POST | `x-voter-id` | 식전 코스 픽 조회·제출                 |

### State Management

`useDateStore` (Zustand v5) — 클라이언트 날짜 상태 단일 소스:

- `today`, `selectedDate`, `currentWeek` (Dayjs[])
- `minDate` (1주 전 월요일), `maxDate` (1주 후 일요일)
- `setSelectedDate`, `goToPrevWeek`, `goToNextWeek`
- 범위 이탈 시 `react-hot-toast` 에러 토스트

### Timezone

날짜 관련 로직은 모두 `src/lib/dayjs.ts`에서 import. `dayjs` 패키지 직접 import 금지.

## Code Conventions

### Style Rules

- **Arrow functions**: 컴포넌트·모듈 모두 `const Fn = () =>` + `export default`
- **Early returns**: 조건이 맞지 않으면 조기 반환
- **Naming**: 변수/함수 camelCase · 컴포넌트/타입 PascalCase · 상수 UPPER_CASE
- **Unused vars**: `_` 접두사 (예: `_req`)
- **Import 순서**: builtin → external → internal → parent → sibling → index, 그룹 간 빈 줄, 알파벳 정렬
- **Max constraints**: 300줄/파일 · 80줄/함수 · complexity ≤ 10 · nesting ≤ 3 · params ≤ 4

### Prettier

| 옵션              | 값                            |
| ----------------- | ----------------------------- |
| `singleQuote`     | `true`                        |
| `semi`            | `true`                        |
| `trailingComma`   | `"es5"`                       |
| `printWidth`      | `80`                          |
| `tabWidth`        | `2`                           |
| `useTabs`         | `false`                       |
| `bracketSpacing`  | `true` (`{ foo }`)            |
| `bracketSameLine` | `false`                       |
| `arrowParens`     | `"always"`                    |
| `endOfLine`       | `"lf"`                        |
| `plugins`         | `prettier-plugin-tailwindcss` |

### Styling

Tailwind CSS v4 — 토큰은 `src/app/globals.css`의 `@theme` 블록에서 관리 (`tailwind.config.ts` 없음).
라이트 단일 테마 (`next-themes` 미사용). 콘텐츠 컨테이너 `min(880px, calc(100% - 40px))`, 홈 `1fr 300px` 2컬럼 (920px 미만 1컬럼).

### Design System

UI·스타일 작업 전 반드시 `DESIGN.md` (repo root)를 읽는다. 토큰·타이포·컬러·간격·shape·접근성 규칙이 모두 정의되어 있다. 명시적 승인 없이 이탈 금지.

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=   # Supabase 프로젝트 URL
SUPABASE_SERVICE_ROLE_KEY=  # Supabase service role key (서버 전용)
REVALIDATE_SECRET=          # ISR 재검증 인증 토큰 (/api/revalidate)
API_KEY=                    # /api/menu 인증 키
CRON_SECRET=                # Cron 인증 토큰 (/api/votes/cleanup Bearer)
```

## Skill Routing

사용자 요청이 아래 조건에 해당하면 **반드시** 해당 스킬을 `Skill` 도구로 먼저 호출한 뒤 진행한다. 직접 `gh`/`git` 명령으로 건너뛰지 말 것.

| 트리거 키워드                                                               | 스킬                  | 경로                                  |
| --------------------------------------------------------------------------- | --------------------- | ------------------------------------- |
| "PR 만들어", "PR 생성", "PR 올려", "pr 내줘", `/pr`                         | `create-pr`           | `.claude/skills/create-pr/`           |
| 컴포넌트·페이지·훅 신규 생성, "만들어", "추가해" (UI 파일)                  | `component-scaffold`  | `.claude/skills/component-scaffold/`  |
| **컴포넌트 파일 작성·수정 시 항상** (component-scaffold 내부에서 자동 호출) | `lean-component`      | `.claude/skills/lean-component/`      |
| UI·스타일 코드 작성 또는 리뷰, DESIGN.md 관련                               | `design-system-guard` | `.claude/skills/design-system-guard/` |
| `src/app/api/*` 추가, "API 만들어", "엔드포인트 추가"                       | `api-route-pattern`   | `.claude/skills/api-route-pattern/`   |
| Supabase 테이블·마이그레이션·RLS·타입 작업                                  | `supabase-schema`     | `.claude/skills/supabase-schema/`     |
| "작업 시작", "티켓 따서", "MEGA-XX 작업", 티켓 번호 언급 + 작업 착수        | `start-ticket`        | `.claude/skills/start-ticket/`        |
| "README 확인", "README 업데이트", "README 최신화" (단독 호출 시)            | `readme-sync`         | `.claude/skills/readme-sync/`         |
| UI 문구 작성·수정·검수, 톤앤매너, 마침표·어투·빈 상태 문구                  | `ux-writing`          | `.claude/skills/ux-writing/`          |
