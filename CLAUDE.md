# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MegaBobs는 메가존 임직원용 구내식당 메뉴 뷰어입니다. 날짜·코스별 식단 조회, 실시간 운영 상태 표시, Slack 봇 연동, MCP 서버를 제공합니다.
Next.js 15 (App Router) + Supabase PostgreSQL, Vercel 배포.

## Commands

```bash
pnpm dev            # Dev server (Turbopack)
pnpm build          # Production build
pnpm lint           # ESLint 검사 (pnpm lint:fix 자동 수정)
pnpm format         # Prettier 포맷 (pnpm format:check 검사)
pnpm test           # Vitest 단위 테스트 (pnpm test:watch watch 모드)
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
├── api/              # Supabase 조회 함수 (getMenu, getAnnouncements)
├── app/api/          # Next.js Route Handlers
├── components/
│   ├── @shared/      # ErrorBoundary, SiteHeader, SiteFooter
│   ├── menu/         # MenuBoard (_BoardEmpty, _CourseRow, _DayBar)
│   └── home/         # HeroStatus, HeroDate, HomeSide
├── constants/
│   └── cafeteria.ts  # 운영 시각 config (단일 소스)
├── lib/
│   └── dayjs.ts      # 타임존 — 항상 여기서 import
├── mcp/              # MCP 서버 진입점 (stdio transport)
├── store/
│   └── useDateStore.ts # 날짜 상태 (Zustand v5)
└── utils/            # cn, date, menuPolicy, voterId
```

### API Routes

| 경로 | 메서드 | 인증 | 용도 |
|------|--------|------|------|
| `/api/menu` | GET | `x-api-key` | `?start=&end=` 메뉴 조회 |
| `/api/slack` | POST | — | 슬래시 커맨드 |
| `/api/slack/warm` | GET | — | Cron 캐시 워밍 (15:00 UTC) |
| `/api/revalidate` | GET | `?secret=` | ISR 강제 재검증 (19:30 UTC) |
| `/api/news/crawl` | GET | Bearer / `?secret=` | 메가존 3사 뉴스 크롤 (GitHub Actions 스케줄 23:00 UTC = 08:00 KST) |
| `/api/mcp` | GET/POST | — | MCP Streamable HTTP |
| `/api/votes` | GET/POST | `x-voter-id` | 코스별 맛 평가 투표 |
| `/api/votes/cleanup` | DELETE | Bearer | 만료 투표 정리 |
| `/api/picks` | GET/POST | `x-voter-id` | 식전 코스 픽 |

### State Management

`useDateStore` (Zustand v5) — `today`, `selectedDate`, `currentWeek` (Dayjs[]), `minDate`(1주 전 월요일)·`maxDate`(1주 후 일요일). 범위 이탈 시 react-hot-toast 에러.

### Timezone

날짜 관련 로직은 모두 `src/lib/dayjs.ts`에서 import. `dayjs` 패키지 직접 import 금지.

## Code Conventions

### Style Rules

- **Arrow functions**: `const Fn = () =>` + `export default`
- **Early returns**: 조건이 맞지 않으면 조기 반환
- **Naming**: 변수/함수 camelCase · 컴포넌트/타입 PascalCase · 상수 UPPER_CASE
- **Unused vars**: `_` 접두사 (예: `_req`)
- **Import 순서**: builtin → external → internal → parent → sibling → index, 알파벳 정렬
- **Max**: 300줄/파일 · 80줄/함수 · complexity ≤ 10 · nesting ≤ 3 · params ≤ 4

### Prettier

`singleQuote: true`, `trailingComma: "es5"`, `printWidth: 80`, `prettier-plugin-tailwindcss`. 전체 설정은 `.prettierrc` 참조.

### Styling

Tailwind CSS v4 — 토큰은 `src/app/globals.css`의 `@theme` 블록 (`tailwind.config.ts` 없음).
라이트 단일 테마. 콘텐츠 컨테이너 `min(880px, calc(100% - 40px))`, 홈 `1fr 300px` 2컬럼 (920px 미만 1컬럼).

### Design System

UI·스타일 작업 전 반드시 `DESIGN.md` (repo root)를 읽는다. 토큰·타이포·컬러·간격·shape·접근성 규칙이 정의되어 있다. 명시적 승인 없이 이탈 금지.

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=   # Supabase 프로젝트 URL
SUPABASE_SERVICE_ROLE_KEY=  # Supabase service role key (서버 전용)
REVALIDATE_SECRET=          # ISR 재검증 인증 토큰 (/api/revalidate)
API_KEY=                    # /api/menu 인증 키
CRON_SECRET=                # Cron 인증 토큰 (/api/votes/cleanup·/api/news/crawl Bearer)
NEXT_PUBLIC_SITE_URL=       # 배포 URL (metadataBase·sitemap에 사용)
```

## 메가존 소식 (News)

`/news` — 메가존 · 메가존클라우드 · 메가존소프트 뉴스를 매일 아침 카드로 모아보기.

- **수집**: Google News RSS (API 키 불필요, 3사 정확 구문 검색). `src/lib/news/` (`sources.ts` → `fetchNews.ts` → `parseRss.ts`)
- **저장**: Supabase `company_news` 테이블 (PK `url` 중복제거). 스키마 SQL: `docs/db/company_news.sql` (대시보드에서 1회 실행)
- **스케줄**: GitHub Actions `.github/workflows/news-crawl.yml` (23:00 UTC = 08:00 KST) 가 Bearer 인증으로 `/api/news/crawl` 호출 → `upsert(onConflict: url)` → `revalidatePath('/news')`. Vercel Hobby cron 제약(하루 1회·최대 2개) 회피. 필요 설정: secret `CRON_SECRET`, variable `SITE_URL`
- **조회**: `src/lib/api/getNews.ts` (서버 전용) → `/news` 페이지 ISR (6h). UI: `src/components/news/NewsCard.tsx`
- Google News RSS 는 본문 스니펫을 제공하지 않아 `summary` 는 보통 null — 카드는 제목·출처·날짜·원문 링크만 노출

## Notion MCP 설정

Notion prefix는 환경마다 다르다 (예: `mcp__notion-local`). 첫 작업 전 ToolSearch로 `notion retrieve` 검색해 확인. 스킬이 ToolSearch로 자동 탐색하는 fallback 있음.

## Skill Routing

사용자 요청이 아래 조건에 해당하면 **반드시** 해당 스킬을 `Skill` 도구로 먼저 호출한 뒤 진행한다. 직접 `gh`/`git` 명령으로 건너뛰지 말 것.

| 트리거 키워드 | 스킬 | 경로 |
|---------------|------|------|
| "PR 만들어", "PR 생성", "PR 올려", "pr 내줘", `/pr` | `create-pr` | `.claude/skills/create-pr/` |
| 컴포넌트·페이지·훅 신규 생성 (UI 파일) | `component-scaffold` | `.claude/skills/component-scaffold/` |
| **컴포넌트 파일 작성·수정 시 항상** | `lean-component` | `.claude/skills/lean-component/` |
| UI·스타일 코드 작성 또는 리뷰, DESIGN.md 관련 | `design-system-guard` | `.claude/skills/design-system-guard/` |
| `src/app/api/*` 추가, "API 만들어", "엔드포인트 추가" | `api-route-pattern` | `.claude/skills/api-route-pattern/` |
| Supabase 테이블·마이그레이션·RLS·타입 작업 | `supabase-schema` | `.claude/skills/supabase-schema/` |
| "작업 시작", "티켓 따서", "MEGA-XX 작업", 티켓 번호 + 착수 | `start-ticket` | `.claude/skills/start-ticket/` |
| "README 확인", "README 업데이트", "README 최신화" (단독) | `readme-sync` | `.claude/skills/readme-sync/` |
| UI 문구 작성·수정·검수, 톤앤매너 | `ux-writing` | `.claude/skills/ux-writing/` |
| `page.tsx` 신규, 라우트 추가, "SEO", "메타데이터" | `seo-optimize` | `~/.claude/skills/seo-optimize/` |
