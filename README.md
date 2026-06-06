# MegaBobs

메가존 직원을 위한 구내식당 메뉴 뷰어입니다. 날짜별 식단 조회, Slack 봇 연동, 실시간 운영 상태 표시를 제공합니다.

---

## 주요 기능

- **날짜별 메뉴 조회** — 주간 캘린더로 날짜를 선택해 코스1 · 코스2 · 테이크아웃 메뉴 확인
- **Slack 봇** — `/밥` 슬래시 커맨드로 오늘 · 내일 · 모레 · 글피 식단 조회
- **반응형 햄버거 메뉴** — 640px 이하에서 풀스크린 드롭다운 메뉴 전환
- **ISR 캐싱** — 6시간 재검증 + 매일 19:30 강제 revalidate + 15:00 캐시 워밍

---

## 기술 스택

| 분류 | 기술 |
|---|---|
| 프레임워크 | Next.js 15 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS v4, Lucide React |
| 상태 관리 | Zustand |
| 데이터베이스 | Supabase (PostgreSQL) |
| 날짜 처리 | dayjs (`Asia/Seoul` timezone) |
| 배포 | Vercel |
| 테스트 | Vitest, Testing Library |
| 포맷 | ESLint, Prettier (+ `prettier-plugin-tailwindcss`) |

---

## 디자인 시스템

자세한 토큰 · 타이포 · 컬러 · 간격 규칙은 [DESIGN.md](DESIGN.md)를 참고하세요.

| 토큰 | 값 | 용도 |
|---|---|---|
| `--color-bg` | `#f3f6fb` | 페이지 배경 (cool blue-tint) |
| `--color-surface` | `#ffffff` | 카드 배경 |
| `--color-ink` | `#111720` | 본문 텍스트 |
| `--color-accent` | `#e2c04c` | 브랜드 키컬러 |
| `--shadow-card` | `0 1px 3px … 0 4px 20px …` | 카드 elevation (border 없음) |

- **경계선 없음** — 카드 구분은 그림자(`--shadow-card`)만 사용
- **애니메이션** — `fadeUp`, `fadeIn`, `softPulse` keyframe (globals.css)
- **반응형** — 데스크톱 2컬럼 (`1fr 300px`), 920px 이하 단일 컬럼

---

## 시작하기

### 환경 변수

`.env.local` 파일을 생성하고 아래 값을 채워주세요:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
REVALIDATE_SECRET=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SLACK_SIGNING_SECRET=
MENU_API_KEY=
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
pnpm mcp            # MCP 서버 실행
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
├── app/
│   ├── api/
│   │   ├── menu/         # GET ?start=&end= — 날짜 범위 메뉴 조회
│   │   ├── slack/        # POST — 슬래시 커맨드, GET warm — 캐시 워밍
│   │   └── revalidate/   # GET ?secret= — ISR 강제 재검증
│   ├── layout.tsx
│   └── page.tsx          # 홈 (ISR, HeroStatus 렌더)
├── components/
│   ├── @shared/          # SiteHeader (frosted glass + 햄버거), SiteFooter
│   ├── board/            # MenuBoard, DayBar, CourseRow, BoardEmpty
│   └── home/             # HeroStatus, HomeSide, HeroDate
├── lib/
│   ├── menu-policy.ts    # CAFETERIA 운영 시각 config (단일 소스)
│   ├── supabase-server.ts
│   ├── api/getMenu.ts
│   ├── dayjs.ts          # Asia/Seoul 설정
│   └── utils.ts
├── store/
│   └── useDateStore.ts   # today, selectedDate, currentWeek, 주 이동
├── types/                # MenuType, MenuCategory, MealType, MenuItemType
└── constants/            # 메뉴 카테고리, 식사 타입, Slack 커맨드, 사이트 링크
```

### 운영 시각 설정

구내식당 운영 시간은 `src/lib/menu-policy.ts`의 `CAFETERIA` 객체 하나에서 관리합니다. 여기만 수정하면 HeroStatus · Slack 봇 · 모든 레이블에 자동 반영됩니다.

```ts
export const CAFETERIA = {
  openHour: 11,
  openMinute: 0,
  closeHour: 13,
  closeMinute: 15,
} as const;
```

---

## Claude 스킬

프로젝트 작업을 돕는 Claude 스킬이 [`.claude/`](.claude/)에 있습니다.

- **`/pr`** — diff 분석 후 PR 본문(요약 · Changes · 테스트 계획)을 생성하고 `gh pr create` 실행
- 스킬 목록은 [`.claude/skills/README.md`](.claude/skills/README.md) 참고
