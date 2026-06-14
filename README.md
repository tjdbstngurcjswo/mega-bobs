# MegaBobs

메가존 직원을 위한 구내식당 메뉴 뷰어입니다. 날짜별 식단 조회, Slack 봇 연동, 실시간 운영 상태 표시를 제공합니다.

---

## 주요 기능

- **날짜별 메뉴 조회** — 주간 캘린더로 날짜를 선택해 코스1 · 코스2 · 테이크아웃 메뉴 확인
- **맛 평가 투표** — 코스별 👍 / 👎 실시간 투표 (Supabase `menu_votes`)
- **식전 픽** — 오늘 뭐 먹을지 코스A / 코스B / 테이크아웃 / 패스 선택 (Supabase `menu_picks`)
- **공지사항** — 정적 TS 기반 공지 시스템, 헤더 벨 아이콘 애니메이션
- **Slack 봇** — `/밥` 슬래시 커맨드로 오늘 · 내일 · 모레 · 글피 식단 조회
- **MCP 서버** — Claude Desktop 연동용 Streamable HTTP 엔드포인트 (`/api/mcp`)
- **ISR 캐싱** — 6시간 재검증 + 매일 19:30 강제 revalidate + 15:00 캐시 워밍

---

## 기술 스택

| 분류         | 기술                                               |
| ------------ | -------------------------------------------------- |
| 프레임워크   | Next.js 15 (App Router, Turbopack)                 |
| UI           | React 19, Tailwind CSS v4, Lucide React            |
| 상태 관리    | Zustand                                            |
| 데이터베이스 | Supabase (PostgreSQL)                              |
| 날짜 처리    | dayjs (`Asia/Seoul` timezone)                      |
| 배포         | Vercel                                             |
| 테스트       | Vitest, Testing Library                            |
| 포맷         | ESLint, Prettier (+ `prettier-plugin-tailwindcss`) |

---

## 디자인 시스템

자세한 토큰 · 타이포 · 컬러 · 간격 규칙은 [DESIGN.md](DESIGN.md)를 참고하세요.

| 토큰              | 값                         | 용도                         |
| ----------------- | -------------------------- | ---------------------------- |
| `--color-bg`      | `#f3f6fb`                  | 페이지 배경 (cool blue-tint) |
| `--color-surface` | `#ffffff`                  | 카드 배경                    |
| `--color-ink`     | `#111720`                  | 본문 텍스트                  |
| `--color-accent`  | `#e2c04c`                  | 브랜드 키컬러                |
| `--shadow-card`   | `0 1px 3px … 0 4px 20px …` | 카드 elevation (border 없음) |

- **경계선 없음** — 카드 구분은 그림자(`--shadow-card`)만 사용
- **애니메이션** — `fadeUp`, `fadeIn`, `softPulse` keyframe (globals.css)
- **반응형** — 데스크톱 2컬럼 (`1fr 300px`), 920px 이하 단일 컬럼

---

## 시작하기

### 환경 변수

`.env.local` 파일을 생성하고 아래 값을 채워주세요:

```
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
REVALIDATE_SECRET=
API_KEY=
CRON_SECRET=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

### 설치 및 실행

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

### 스크립트

```bash
pnpm dev            # 개발 서버 (Turbopack)
pnpm build          # 프로덕션 빌드
pnpm start          # 프로덕션 서버
pnpm lint           # ESLint 검사
pnpm lint:fix       # ESLint 자동 수정
pnpm format         # Prettier 포맷
pnpm format:check   # Prettier 검사
pnpm test           # Vitest 단위 테스트
pnpm mcp            # MCP 서버 실행 (stdio transport)
pnpm test:watch     # Vitest watch 모드
```

---

## 아키텍처

### 데이터 흐름

```
Supabase daily_menu
  → page.tsx (서버 fetch, ISR 6h)
  → MenuBoard (client)
  → useDateStore (Zustand)
  → DayBar / CourseRow
```

### 주요 디렉토리

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
│   │   ├── votes/        # GET/POST — 코스별 맛 평가 투표 (menu_votes)
│   │   │   └── cleanup/  # DELETE — 만료 투표 데이터 정리
│   │   ├── picks/        # GET/POST — 식전 코스 픽 (menu_picks)
│   │   ├── mcp/          # GET/POST — MCP Streamable HTTP
│   │   ├── slack/        # POST — 슬래시 커맨드, GET warm — 캐시 워밍
│   │   └── revalidate/   # GET ?secret= — ISR 강제 재검증
│   ├── notice/           # 공지사항 페이지
│   ├── layout.tsx
│   └── page.tsx          # 홈 (ISR, HeroStatus 렌더)
├── assets/
│   └── fonts/            # Pretendard 셀프호스팅 폰트
├── components/
│   ├── @shared/          # ErrorBoundary, SiteHeader, SiteFooter, PageLayout
│   ├── menu/             # MenuBoard (_MenuBoardEmpty, _MenuBoardCourseRow, _MenuBoardDayBar)
│   └── home/             # HeroStatus, HeroDate
├── constants/
│   ├── cafeteria.ts      # CAFETERIA 운영 시각 config (단일 소스)
│   ├── menu.ts           # 코스 카테고리 한글 레이블
│   ├── site.ts           # NAV_ITEMS, FOOTER_LINKS
│   └── slack.ts          # Slack 커맨드 맵
├── data/
│   └── announcements.ts  # 정적 공지 데이터 (TS 배열)
├── hooks/
│   ├── useHasMounted.ts  # SSR/CSR 하이드레이션 불일치 방지 훅
│   ├── usePick.ts        # 식전 픽 조회·제출 훅
│   └── useVote.ts        # 맛 평가 투표 조회·제출 훅
├── lib/
│   ├── dayjs.ts          # Asia/Seoul 설정
│   └── supabaseServer.ts
├── mcp/
│   ├── index.ts          # MCP 서버 진입점 (stdio transport)
│   └── server.ts         # MCP 도구 정의
├── store/
│   └── useDateStore.ts   # today, selectedDate, currentWeek, 주 이동
└── utils/
    ├── announcementPolicy.ts # 신규 공지 여부 판별 함수
    ├── cn.ts             # cn() 클래스 병합 유틸
    ├── date.ts           # formatYYYYMMDD(), getWeekDays()
    ├── menuPolicy.ts     # 운영 시각 판별 함수
    └── voterId.ts        # 익명 투표자 ID 생성·관리
```

### 운영 시각 설정

구내식당 운영 시간은 `src/constants/cafeteria.ts`의 `CAFETERIA` 객체 하나에서 관리합니다. 여기만 수정하면 HeroStatus · Slack 봇 · 모든 레이블에 자동 반영됩니다.

```ts
const CAFETERIA = {
  openHour: 11,
  openMinute: 0,
  closeHour: 13,
  closeMinute: 15,
} as const;
```

---

## Claude 스킬

프로젝트 작업을 돕는 Claude 스킬이 [`.claude/`](.claude/)에 있습니다.

| 커맨드                          | 설명                                                                               |
| ------------------------------- | ---------------------------------------------------------------------------------- |
| `/pr`                           | diff 분석 → PR 본문(요약 · Changes · Mermaid · 테스트 계획) 생성 후 `gh pr create` |
| `README 확인` / `README 최신화` | README 갭 분석 → 누락 항목 수정 후 커밋                                            |

전체 스킬 목록과 발동 조건은 [`.claude/skills/README.md`](.claude/skills/README.md) 참고.
