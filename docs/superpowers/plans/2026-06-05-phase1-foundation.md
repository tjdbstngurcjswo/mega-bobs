# megabobs Phase 1 — 플랜 ①: 디자인 파운데이션 + 메뉴보드 홈

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 기존 375px 모바일 앱을 새 디자인 시스템(잉크+옐로우, 풀 스퀘어, 880px 반응형)으로 리스킨하고, 홈을 "메뉴보드" 중심으로 재구성한다 (투표는 플랜 ②).

**Architecture:** 기존 데이터 흐름(Supabase `daily_menu` → `page.tsx` ISR → `useMenuStore`/`useDateStore`)은 그대로 두고 표현 계층만 교체한다. `useDateStore`가 이미 ±1주 정책(minDate/maxDate + 토스트)을 구현하므로 재사용. 새 컴포넌트는 기존 것을 수정하지 않고 별도 파일로 만들어 홈에서 갈아끼운 뒤, 마지막 태스크에서 구컴포넌트를 제거한다.

**Tech Stack:** Next.js 15 App Router · Tailwind CSS 4 (`@theme` 토큰) · zustand · dayjs(Asia/Seoul, 반드시 `@/lib/dayjs`에서 import) · vitest + @testing-library/react (신규)

**참조 문서:**
- 기획 v2: Notion 「기획 문서: megabobs.com Phase 1」 (§4.1, §5, §5.1, F1)
- 디자인: `docs/design/2026-06-05-phase1-design.md` + 목업 `docs/design/mockups/home-b.html` (픽셀 스펙 = 이 HTML의 CSS)
- 상태: `docs/design/mockups/states.html` (CLOSED / COMING UP / 날짜 네비 경계)

**이 플랜에서 하지 않는 것:** 투표(픽/맛평가, 플랜 ②) · 게임(③) · 맛집(④) · 블로그/소식 콘텐츠(⑤). 우측 진입 리스트의 미구현 라우트는 `href="#"` placeholder.

---

## 파일 구조

```
src/
├── app/
│   ├── layout.tsx            # 수정: Pretendard, ThemeProvider 제거, SiteHeader/Footer
│   ├── page.tsx              # 수정: 히어로 + 2컬럼 그리드(MenuBoard + HomeSide)
│   ├── globals.css           # 수정: 새 디자인 토큰 (@theme)
│   └── notice/page.tsx       # 생성: 공지 + 만든 사람들
├── components/
│   ├── site/
│   │   ├── SiteHeader.tsx    # 생성: 다크 밴드 + 워드마크 + 내비 + 공지 벨
│   │   ├── SiteFooter.tsx    # 생성
│   │   └── index.ts          # 생성
│   ├── board/
│   │   ├── MenuBoard.tsx     # 생성: 옐로우 헤더 + DayBar + 코스 행들
│   │   ├── DayBar.tsx        # 생성: 요일 칩 7개 + 주 이동
│   │   ├── CourseRow.tsx     # 생성: 코스 라벨 + 합계 kcal + 메뉴 리스트
│   │   └── BoardEmpty.tsx    # 생성: CLOSED / COMING UP
│   └── home/
│       └── HomeSide.tsx      # 생성: 랜덤 추천 카드 + 진입 리스트 4행
├── lib/
│   └── menu-policy.ts        # 생성: 다음 주 공개(목요일) 판정
├── constants/
│   └── site.ts               # 생성: 내비/진입 항목, 운영시간 상수
data/
└── notices.json              # 생성
tests/
├── menu-policy.test.ts       # 생성
├── course-row.test.tsx       # 생성
└── board-empty.test.tsx      # 생성
```

기존 유지(이번 플랜에서 수정 금지): `useDateStore`, `useMenuStore`, `getMenu`, `MenuType`, API 라우트.
Task 8에서 제거: `ThemeProvider/ThemeToggle/ThemeDropdown`, `Header.tsx`, `MenuSelector/WeekSelect/DaySelect/CourseSelect/MenuSection`, `MobileContainer`, `next-themes` 의존성.

---

### Task 1: 테스트 인프라 (vitest)

현재 테스트 프레임워크가 없다 (CLAUDE.md 명시). vitest + RTL을 설치한다.

**Files:**
- Modify: `package.json` (scripts)
- Create: `vitest.config.ts`
- Create: `tests/setup.ts`
- Create: `tests/smoke.test.ts`

- [ ] **Step 1: 의존성 설치**

```bash
pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

- [ ] **Step 2: vitest 설정 작성**

`vitest.config.ts`:
```ts
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vitest/config';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: {'@': path.resolve(__dirname, './src')},
  },
});
```

`tests/setup.ts`:
```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 3: package.json에 스크립트 추가**

`"scripts"`에 추가:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: 스모크 테스트 작성 + 실행**

`tests/smoke.test.ts`:
```ts
import {expect, test} from 'vitest';

test('vitest runs', () => {
  expect(1 + 1).toBe(2);
});
```

Run: `pnpm test`
Expected: `1 passed`

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml vitest.config.ts tests/
git commit -m "chore: vitest 테스트 인프라 추가"
```

---

### Task 2: 디자인 토큰 + Pretendard + 라이트 단일 테마

**Files:**
- Modify: `src/app/globals.css` (전체 교체)
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Pretendard 설치**

```bash
pnpm add pretendard
```

- [ ] **Step 2: globals.css 전체 교체**

목업 `shared.css`의 토큰을 Tailwind 4 `@theme`으로 이식. 다크 토큰은 제거(라이트 단일).

`src/app/globals.css`:
```css
@import 'tailwindcss';
@import 'pretendard/dist/web/static/pretendard.css';

@theme {
  /* 디자인 시스템 — docs/design/2026-06-05-phase1-design.md §1 */
  --color-bg: #f5f5f3; /* 페이지 배경 */
  --color-surface: #ffffff; /* 카드 */
  --color-surface-warm: #f7f7f5;
  --color-board: #111111; /* 잉크 — 헤더 밴드/다크 카드 */
  --color-board-2: #242424; /* 활성 탭 면 */
  --color-ink: #111111;
  --color-ink-2: #454545;
  --color-muted: #8a8a8a;
  --color-line: #e3e3e0; /* 헤어라인 보더 */
  --color-cream: #f5f5f3; /* 다크 위 텍스트 */
  --color-cream-2: #9a9a9a;
  --color-accent: #e2c04c; /* 키컬러 — 저채도 옐로우 */
  --color-accent-deep: #c2a02e;
  --color-accent-soft: #faf4d9;
  --color-accent-text: #997400; /* 라이트 배경 위 옐로우 텍스트 */
  --color-highlight: #f0e0a0; /* 헤드라인 형광펜 */
  --color-down: #767676;
  --color-down-soft: #f1f1ef;

  --font-sans: 'Pretendard', -apple-system, sans-serif;

  /* 풀 스퀘어 — radius 사용 금지 (물리적 원형 제외) */
  --radius-none: 0;

  --shadow-flat: 0 1px 2px rgba(0, 0, 0, 0.05);
}

body {
  background: var(--color-bg);
  color: var(--color-ink);
  font-family: var(--font-sans);
  word-break: keep-all;
}
```

- [ ] **Step 3: layout.tsx 교체 (테마 제거, 메타 갱신)**

`src/app/layout.tsx`:
```tsx
import {Analytics} from '@vercel/analytics/next';
import type {Metadata} from 'next';
import {Toaster} from 'react-hot-toast';

import './globals.css';

export const metadata: Metadata = {
  title: '메가밥스 — 메가존 구내식당 점심 허브',
  description: '구내식당 메뉴, 투표, 내기 게임, 지정타 맛집까지',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  other: {
    'google-adsense-account': 'ca-pub-4501038602130909',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="bg-bg text-ink">
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 2000,
            style: {
              background: '#111111',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '500',
              borderRadius: '0',
            },
          }}
        />
        <Analytics mode="production" />
      </body>
    </html>
  );
}
```

주의: `AppLayout`/`ThemeProvider` import 제거. 이 시점에 `page.tsx`가 깨지지 않도록 Task 5-6 전까지는 빌드만 통과하면 됨(`pnpm build`는 Task 6 후 재확인).

- [ ] **Step 4: dev 서버로 폰트·배경 확인**

Run: `pnpm dev` → http://localhost:3000
Expected: 배경 #F5F5F3, Pretendard 적용 (기존 화면은 깨져 보여도 무방 — Task 6에서 재조립)

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx package.json pnpm-lock.yaml
git commit -m "feat: 디자인 토큰(잉크+옐로우) + Pretendard + 라이트 단일 테마"
```

---

### Task 3: 메뉴 공개 정책 유틸 (TDD)

다음 주 메뉴는 목요일 공개(§5.1). DayBar/BoardEmpty가 사용한다.

**Files:**
- Create: `src/lib/menu-policy.ts`
- Test: `tests/menu-policy.test.ts`

- [ ] **Step 1: 실패하는 테스트 작성**

`tests/menu-policy.test.ts`:
```ts
import {describe, expect, test} from 'vitest';

import dayjs from '@/lib/dayjs';
import {CAFETERIA, isNextWeek, isNextWeekPublished} from '@/lib/menu-policy';

describe('isNextWeekPublished — 다음 주 메뉴는 목요일 공개', () => {
  test('월요일에는 미공개', () => {
    expect(isNextWeekPublished(dayjs.tz('2026-06-01'))).toBe(false); // 월
  });
  test('수요일에도 미공개', () => {
    expect(isNextWeekPublished(dayjs.tz('2026-06-03'))).toBe(false); // 수
  });
  test('목요일부터 공개', () => {
    expect(isNextWeekPublished(dayjs.tz('2026-06-04'))).toBe(true); // 목
  });
  test('일요일(주말)에도 공개 상태 유지', () => {
    expect(isNextWeekPublished(dayjs.tz('2026-06-07'))).toBe(true); // 일
  });
});

describe('isNextWeek — 기준일이 오늘의 다음 주인지', () => {
  const today = dayjs.tz('2026-06-05'); // 금
  test('다음 주 월요일은 true', () => {
    expect(isNextWeek(dayjs.tz('2026-06-08'), today)).toBe(true);
  });
  test('이번 주 일요일은 false', () => {
    expect(isNextWeek(dayjs.tz('2026-06-07'), today)).toBe(false);
  });
  test('지난주는 false', () => {
    expect(isNextWeek(dayjs.tz('2026-05-29'), today)).toBe(false);
  });
});

test('CAFETERIA 운영시간 상수', () => {
  expect(CAFETERIA.openLabel).toBe('11:30 – 13:00');
  expect(CAFETERIA.closeHour).toBe(13);
});
```

- [ ] **Step 2: 실패 확인**

Run: `pnpm test tests/menu-policy.test.ts`
Expected: FAIL — `Cannot find module '@/lib/menu-policy'`

- [ ] **Step 3: 구현**

주의: 기존 `getWeekDays`(`src/lib/utils.ts`)가 월요일 시작 주를 **이미 로케일-비의존 수동 계산**으로 만든다. `startOf('week')`는 로케일 weekStart에 따라 일/월이 갈리므로 쓰지 말고, **`getWeekDays(d)[0]`(월요일 시작일) 재사용**으로 일관성 유지. dayjs `day()`: 일=0, 목=4. *(리뷰 #4 반영)*

`src/lib/menu-policy.ts`:
```ts
import dayjs from '@/lib/dayjs';
import {getWeekDays} from '@/lib/utils';

/** 구내식당 운영 정보 — 하드코딩 1곳에만 둔다 (§5.1: 마감 시각은 여기서 파생) */
export const CAFETERIA = {
  openLabel: '11:30 – 13:00',
  closeHour: 13,
} as const;

/** 월요일 시작 주의 첫날 — getWeekDays(로케일 비의존)와 동일 기준 */
const startOfWeekMon = (d: dayjs.Dayjs) => getWeekDays(d)[0];

/** date가 today 기준 다음 주에 속하는가 */
export const isNextWeek = (date: dayjs.Dayjs, today: dayjs.Dayjs) =>
  startOfWeekMon(date).isSame(startOfWeekMon(today).add(7, 'day'), 'day');

/** 다음 주 메뉴 공개 여부 — 매주 목요일 공개 (목·금·토·일 = 공개됨) */
export const isNextWeekPublished = (now: dayjs.Dayjs) => {
  const d = now.day();
  return d === 0 || d >= 4;
};
```

- [ ] **Step 4: 통과 확인**

Run: `pnpm test tests/menu-policy.test.ts`
Expected: PASS (8 tests)

- [ ] **Step 5: Commit**

```bash
git add src/lib/menu-policy.ts tests/menu-policy.test.ts
git commit -m "feat: 메뉴 공개 정책 유틸 (다음 주 목요일 공개 판정)"
```

---

### Task 4: 사이트 셸 — SiteHeader / SiteFooter / 상수

목업 기준: `home-b.html`의 `header`/`.site-foot`. 다크 밴드(#111111), 워드마크 = 옐로우 11px 사각 + "메가밥스", 내비 5개(활성 = #242424 면 + 옐로우 밑줄), 우측 공지 벨(NEW 닷). 풋터: 워드마크/링크 4종/© 메타.

**Files:**
- Create: `src/constants/site.ts`
- Create: `src/components/site/SiteHeader.tsx`
- Create: `src/components/site/SiteFooter.tsx`
- Create: `src/components/site/index.ts`

- [ ] **Step 1: 사이트 상수 작성**

`src/constants/site.ts`:
```ts
export type NavItem = {label: string; href: string; disabled?: boolean};

/** 미구현 라우트는 disabled — 후속 플랜에서 해제 */
export const NAV_ITEMS: NavItem[] = [
  {label: '오늘의 메뉴', href: '/'},
  {label: '내기 게임', href: '/games', disabled: true},
  {label: '주변 맛집', href: '/nearby', disabled: true},
  {label: '블로그', href: '/blog', disabled: true},
  {label: '메가존 소식', href: '/news', disabled: true},
];

export const HOME_ENTRIES = [
  {no: '01', label: '내기 게임', desc: '사다리 · 슬롯 · 풍선으로 커피 내기', href: '/games', isNew: true},
  {no: '02', label: '주변 맛집', desc: '지정타 직장인 검증 맛집 10곳', href: '/nearby', isNew: false},
  {no: '03', label: '블로그', desc: '어제의 투표 결과와 점심 이야기', href: '/blog', isNew: false},
  {no: '04', label: '메가존 소식', desc: '우리 회사 새 소식 모아보기', href: '/news', isNew: false},
] as const;

export const FOOTER_LINKS = [
  {label: '공지사항', href: '/notice'},
  {label: '만든 사람들', href: '/notice#makers'},
  {label: '슬랙 #megabobs', href: '#'},
  {label: '맛집 · 버그 제보', href: '#'},
] as const;
```

- [ ] **Step 2: SiteHeader 작성**

`src/components/site/SiteHeader.tsx`:
```tsx
'use client';

import {Bell} from 'lucide-react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';

import {NAV_ITEMS} from '@/constants/site';
import {cn} from '@/lib/utils';

const SiteHeader = () => {
  const pathname = usePathname();

  return (
    <header className="bg-board">
      <div className="mx-auto flex h-16 w-[min(880px,calc(100%-40px))] items-center gap-7">
        <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-cream">
          <span aria-hidden className="inline-block size-[11px] bg-accent" />
          메가밥스
        </Link>
        <nav className="flex flex-1 gap-0.5 overflow-x-auto whitespace-nowrap">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.disabled ? '#' : item.href}
                aria-disabled={item.disabled}
                className={cn(
                  'px-3 py-2 text-sm font-semibold',
                  active
                    ? 'bg-board-2 text-white shadow-[inset_0_-2px_0_var(--color-accent)]'
                    : 'text-cream-2 hover:bg-board-2',
                  item.disabled && 'cursor-default opacity-50'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Link
          href="/notice"
          title="공지사항"
          aria-label="공지사항"
          className="relative flex size-9 items-center justify-center text-cream"
        >
          <Bell size={18} strokeWidth={2.4} />
          <span aria-hidden className="absolute top-[7px] right-[6px] size-1.5 bg-accent" />
        </Link>
      </div>
    </header>
  );
};

export default SiteHeader;
```

`cn`이 `src/lib/utils.ts`에 없으면 추가:
```ts
import clsx, {type ClassValue} from 'clsx';

export const cn = (...inputs: ClassValue[]) => clsx(inputs);
```
검증 결과(리뷰 #3): `clsx`는 **이미 `dependencies`에 존재** — `pnpm add clsx`는 사실상 no-op이므로 생략 가능. `cn` 헬퍼 추가만 하면 됨.

- [ ] **Step 3: SiteFooter 작성**

`src/components/site/SiteFooter.tsx`:
```tsx
import Link from 'next/link';

import {FOOTER_LINKS} from '@/constants/site';

const SiteFooter = () => (
  <footer className="mt-16 bg-board text-cream-2">
    <div className="mx-auto flex w-[min(880px,calc(100%-40px))] flex-col gap-3 py-7">
      <div className="flex items-center gap-2 text-[15px] font-extrabold text-cream">
        <span aria-hidden className="inline-block size-[9px] bg-accent" />
        메가밥스
        <span className="ml-1 text-xs font-medium text-cream-2">메가존 구내식당 비공식 점심 허브</span>
      </div>
      <div className="flex flex-wrap gap-4 text-[12.5px]">
        {FOOTER_LINKS.map((l) => (
          <Link
            key={l.label}
            href={l.href}
            className="border-b border-[#3A3A3A] pb-0.5 font-bold text-cream"
          >
            {l.label}
          </Link>
        ))}
      </div>
      <div className="text-[11.5px] leading-relaxed text-[#6E6E6E]">
        © 2026 megabobs · 메뉴는 매주 목요일 업데이트 · 정보 오류 제보 환영
      </div>
    </div>
  </footer>
);

export default SiteFooter;
```

`src/components/site/index.ts`:
```ts
export {default as SiteHeader} from './SiteHeader';
export {default as SiteFooter} from './SiteFooter';
```

- [ ] **Step 4: lint 확인**

Run: `pnpm lint`
Expected: 신규 파일 에러 0 (기존 파일 경고는 무시)

- [ ] **Step 5: Commit**

```bash
git add src/constants/site.ts src/components/site/ src/lib/utils.ts package.json pnpm-lock.yaml
git commit -m "feat: 사이트 셸 — 다크 밴드 헤더(공지 벨) + 풋터"
```

---

### Task 5: 메뉴보드 — CourseRow / BoardEmpty (TDD) / DayBar / MenuBoard

목업 기준: `home-b.html`의 `.board-card`. 구성: 옐로우 헤더("메뉴" + 운영시간) → DayBar(요일 칩 7) → 코스 행 3개. 코스 행 = 라벨(코스 A/B/테이크아웃, accent-text) + 합계 kcal + **동등한 메뉴 리스트**(이름 + 메뉴별 kcal, '메인 메뉴' 강조 금지).

**Files:**
- Create: `src/components/board/CourseRow.tsx`
- Create: `src/components/board/BoardEmpty.tsx`
- Create: `src/components/board/DayBar.tsx`
- Create: `src/components/board/MenuBoard.tsx`
- Test: `tests/course-row.test.tsx`, `tests/board-empty.test.tsx`

- [ ] **Step 1: CourseRow 실패 테스트 작성**

`tests/course-row.test.tsx`:
```tsx
import {render, screen} from '@testing-library/react';
import {describe, expect, test} from 'vitest';

import CourseRow from '@/components/board/CourseRow';
import {MenuType} from '@/types/menu';

const menu: MenuType = {
  category: 'COURSE_1',
  date: '2026-06-05',
  meal: 'LUNCH' as MenuType['meal'],
  items: [
    {name: '제육볶음', kcal: 350},
    {name: '백미밥', kcal: 270},
  ],
};

describe('CourseRow', () => {
  test('코스 라벨과 합계 kcal을 표시한다', () => {
    render(<CourseRow menu={menu} />);
    expect(screen.getByText('코스1')).toBeInTheDocument();
    expect(screen.getByText('620 kcal')).toBeInTheDocument();
  });

  test('모든 메뉴를 동등하게 나열하고 메뉴별 kcal 단위를 병기한다', () => {
    render(<CourseRow menu={menu} />);
    expect(screen.getByText('제육볶음')).toBeInTheDocument();
    expect(screen.getByText('350kcal')).toBeInTheDocument();
    expect(screen.getByText('270kcal')).toBeInTheDocument();
  });

  test('kcal이 0인 메뉴는 숫자를 생략한다 (레이아웃 유지)', () => {
    render(
      <CourseRow
        menu={{...menu, items: [{name: '피클', kcal: 0}]}}
      />
    );
    expect(screen.getByText('피클')).toBeInTheDocument();
    expect(screen.queryByText('0kcal')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: 실패 확인**

Run: `pnpm test tests/course-row.test.tsx`
Expected: FAIL — `Cannot find module '@/components/board/CourseRow'`

- [ ] **Step 3: CourseRow 구현**

`src/components/board/CourseRow.tsx`:
```tsx
import {MenuCategoryLabel} from '@/constants/menu';
import {MenuType} from '@/types/menu';

interface CourseRowProps {
  menu: MenuType;
}

const CourseRow = ({menu}: CourseRowProps) => {
  const total = menu.items.reduce((sum, item) => sum + (item.kcal ?? 0), 0);

  return (
    <div className="border-b border-line px-6 py-5 last:border-b-0">
      <div className="flex items-baseline gap-2.5">
        <span className="text-[11px] font-extrabold tracking-wider text-accent-text">
          {MenuCategoryLabel[menu.category].ko}
        </span>
        {total > 0 && (
          <span className="ml-auto text-xs font-semibold text-muted">{total} kcal</span>
        )}
      </div>
      <p className="mt-1.5 text-[15px] leading-relaxed font-semibold text-ink">
        {menu.items.map((item, i) => (
          <span key={item.name} className="whitespace-nowrap">
            {item.name}
            {item.kcal > 0 && (
              <i className="ml-0.5 text-[10.5px] font-semibold text-muted not-italic">
                {item.kcal}
                kcal
              </i>
            )}
            {i < menu.items.length - 1 && <span className="mx-1.5 text-[#C9C9C6]">·</span>}
          </span>
        ))}
      </p>
    </div>
  );
};

export default CourseRow;
```

- [ ] **Step 4: 통과 확인**

Run: `pnpm test tests/course-row.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 5: BoardEmpty 실패 테스트 작성**

`tests/board-empty.test.tsx`:
```tsx
import {render, screen} from '@testing-library/react';
import {describe, expect, test} from 'vitest';

import BoardEmpty from '@/components/board/BoardEmpty';

describe('BoardEmpty', () => {
  test('CLOSED — 메뉴 없는 날 안내', () => {
    render(<BoardEmpty variant="closed" />);
    expect(screen.getByText('CLOSED')).toBeInTheDocument();
    expect(screen.getByText('오늘은 구내식당이 쉬는 날이에요')).toBeInTheDocument();
  });

  test('COMING UP — 다음 주 미공개 안내', () => {
    render(<BoardEmpty variant="comingUp" />);
    expect(screen.getByText('COMING UP')).toBeInTheDocument();
    expect(screen.getByText('다음 주 메뉴는 목요일에 공개돼요')).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: 실패 확인 → BoardEmpty 구현**

Run: `pnpm test tests/board-empty.test.tsx` → FAIL 확인 후:

`src/components/board/BoardEmpty.tsx`:
```tsx
interface BoardEmptyProps {
  variant: 'closed' | 'comingUp';
}

const COPY = {
  closed: {
    label: 'CLOSED',
    title: '오늘은 구내식당이 쉬는 날이에요',
    body: '그래도 점심은 먹어야죠 — 주변 맛집은 어때요?',
  },
  comingUp: {
    label: 'COMING UP',
    title: '다음 주 메뉴는 목요일에 공개돼요',
    body: '영양사 선생님이 메뉴를 짜는 중이에요. 목요일에 다시 확인해 주세요',
  },
} as const;

const BoardEmpty = ({variant}: BoardEmptyProps) => {
  const copy = COPY[variant];

  return (
    <div className="px-6 py-12 text-center">
      <div className="text-[13px] font-black tracking-[0.3em] text-accent-text">{copy.label}</div>
      <h3 className="mt-3 text-[17px] font-extrabold">{copy.title}</h3>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{copy.body}</p>
    </div>
  );
};

export default BoardEmpty;
```

Run: `pnpm test tests/board-empty.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 7: DayBar 구현 (store 연동 — 수동 검증)**

`src/components/board/DayBar.tsx`:
```tsx
'use client';

import {useDateStore} from '@/store/useDateStore';
import {cn} from '@/lib/utils';

const DOW = ['일', '월', '화', '수', '목', '금', '토'];

const DayBar = () => {
  const {today, selectedDate, currentWeek, setSelectedDate, goToPrevWeek, goToNextWeek} =
    useDateStore();

  return (
    <div className="flex items-center gap-2 border-b border-line bg-surface px-5 py-3">
      <button
        onClick={goToPrevWeek}
        aria-label="지난주 메뉴 보기"
        className="flex h-11 w-7 shrink-0 items-center justify-center border border-line text-ink"
      >
        ‹
      </button>
      <div className="flex flex-1 gap-1.5">
        {currentWeek.map((day) => {
          const isToday = day.isSame(today, 'day');
          const isSelected = day.isSame(selectedDate, 'day');
          const isPast = day.isBefore(today, 'day');
          return (
            <button
              key={day.format('YYYY-MM-DD')}
              onClick={() => setSelectedDate(day)}
              className={cn(
                'flex flex-1 flex-col items-center gap-0.5 border py-1.5',
                isSelected
                  ? isToday
                    ? 'border-accent bg-accent'
                    : 'border-ink bg-ink'
                  : 'border-line bg-surface'
              )}
            >
              <span
                className={cn(
                  'text-[10px] font-bold',
                  isSelected ? (isToday ? 'text-ink/55' : 'text-white/60') : 'text-muted',
                  !isSelected && isPast && 'text-[#B5B5B2]'
                )}
              >
                {isToday ? '오늘' : DOW[day.day()]}
              </span>
              <span
                className={cn(
                  'text-[13.5px] font-extrabold',
                  isSelected ? (isToday ? 'text-ink' : 'text-white') : 'text-ink',
                  !isSelected && isPast && 'text-[#B5B5B2]'
                )}
              >
                {day.date()}
              </span>
            </button>
          );
        })}
      </div>
      <button
        onClick={goToNextWeek}
        aria-label="다음 주 메뉴 보기"
        className="flex h-11 w-7 shrink-0 items-center justify-center border border-line text-ink"
      >
        ›
      </button>
    </div>
  );
};

export default DayBar;
```

비고: 범위 경계(전전주/다다음주) 차단과 토스트는 `useDateStore`가 이미 처리한다 — 재구현 금지.

- [ ] **Step 8: MenuBoard 조립**

`src/components/board/MenuBoard.tsx`:
```tsx
'use client';

import {useMemo} from 'react';

import {MENU_CATEGORIES} from '@/constants/menu';
import dayjs from '@/lib/dayjs';
import {CAFETERIA, isNextWeek, isNextWeekPublished} from '@/lib/menu-policy';
import {formatYYYYMMDD} from '@/lib/utils';
import {useDateStore} from '@/store/useDateStore';
import {useMenuStore} from '@/store/useMenuStore';

import BoardEmpty from './BoardEmpty';
import CourseRow from './CourseRow';
import DayBar from './DayBar';

const MenuBoard = () => {
  const {today, selectedDate} = useDateStore();
  const menus = useMenuStore((s) => s.menus);

  const dayMenus = useMemo(() => {
    const key = formatYYYYMMDD(selectedDate);
    const found = menus.filter((m) => m.date === key && m.items.length > 0);
    // 코스 순서 고정: 코스1 → 코스2 → 테이크아웃
    return MENU_CATEGORIES.map((c) => found.find((m) => m.category === c)).filter(
      (m): m is NonNullable<typeof m> => Boolean(m)
    );
  }, [menus, selectedDate]);

  const emptyVariant =
    isNextWeek(selectedDate, today) && !isNextWeekPublished(dayjs().tz())
      ? 'comingUp'
      : 'closed';

  return (
    <section className="bg-surface shadow-flat border border-line">
      <div className="flex items-center justify-between bg-accent px-6 py-4 text-ink">
        <h2 className="text-base font-extrabold">메뉴</h2>
        <span className="text-xs font-bold text-ink/60">
          메가존 구내식당 · {CAFETERIA.openLabel}
        </span>
      </div>
      <DayBar />
      {dayMenus.length > 0 ? (
        dayMenus.map((menu) => <CourseRow key={menu.category} menu={menu} />)
      ) : (
        <BoardEmpty variant={emptyVariant} />
      )}
    </section>
  );
};

export default MenuBoard;
```

- [ ] **Step 9: 전체 테스트 + lint**

Run: `pnpm test && pnpm lint`
Expected: 테스트 전부 PASS, 신규 파일 lint 클린

- [ ] **Step 10: Commit**

```bash
git add src/components/board/ tests/course-row.test.tsx tests/board-empty.test.tsx
git commit -m "feat: 메뉴보드 — 코스 행(메뉴별 kcal) + 날짜 바 + 빈 상태(CLOSED/COMING UP)"
```

---

### Task 6: 홈 조립 — 히어로 + 2컬럼 그리드 + HomeSide

목업 기준: `home-b.html`. 히어로 = 날짜 라벨 + "오늘 점심, 정하셨나요?"(옐로우 형광펜). 그리드 = 보드(1fr) + 우측 300px(랜덤 카드 + 진입 리스트 4행, 보드 높이 스트레치). 920px 이하 1컬럼.

**Files:**
- Create: `src/components/home/HomeSide.tsx`
- Modify: `src/app/page.tsx` (전체 교체)

- [ ] **Step 1: HomeSide 작성**

`src/components/home/HomeSide.tsx`:
```tsx
import Link from 'next/link';

import {HOME_ENTRIES} from '@/constants/site';

const HomeSide = () => (
  <aside className="flex flex-col gap-4">
    <div className="relative overflow-hidden bg-board p-5 text-cream">
      <span
        aria-hidden
        className="absolute right-3 -bottom-7 text-[110px] leading-none font-black text-cream opacity-10"
      >
        ?
      </span>
      <h3 className="text-lg font-extrabold">오늘 뭐 먹지?</h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-cream-2">
        구내식당과 지정타 맛집 중에서
        <br />
        점심 메뉴를 골라드려요
      </p>
      {/* 랜덤 추천 동작은 플랜 ④(맛집 데이터) 이후 활성화 */}
      <button
        disabled
        className="relative mt-4 w-full bg-accent py-3 text-[15px] font-extrabold text-ink disabled:opacity-60"
      >
        랜덤 추천 받기 (준비 중)
      </button>
    </div>
    <div className="flex flex-1 flex-col gap-2.5">
      {HOME_ENTRIES.map((entry) => (
        <Link
          key={entry.no}
          href="#"
          aria-disabled
          className="shadow-flat flex flex-1 items-center gap-3.5 border border-line bg-surface px-4"
        >
          <span className="w-[26px] text-[13px] font-black text-accent-text">{entry.no}</span>
          <span className="flex-1">
            <b className="block text-sm font-extrabold">
              {entry.label}
              {entry.isNew && (
                <i className="ml-1.5 bg-accent px-1.5 py-0.5 align-[2px] text-[9px] font-extrabold text-ink not-italic">
                  NEW
                </i>
              )}
            </b>
            <span className="mt-0.5 block text-[10.5px] text-muted">{entry.desc}</span>
          </span>
          <span aria-hidden className="text-[#C9C9C6]">
            ›
          </span>
        </Link>
      ))}
    </div>
  </aside>
);

export default HomeSide;
```

- [ ] **Step 2: page.tsx 교체**

기존 데이터 페치(±1주)는 그대로 유지. `MenuSelector`는 store 주입용으로만 쓰던 `useEffect` 패턴을 빼앗아 새 `MenuBoard`가 직접 store를 읽도록, store 주입은 작은 클라이언트 컴포넌트로 분리한다.

`src/components/board/MenuStoreHydrator.tsx` 생성:
```tsx
'use client';

import {useEffect} from 'react';

import {useMenuStore} from '@/store/useMenuStore';
import {MenuType} from '@/types/menu';

const MenuStoreHydrator = ({menus}: {menus: MenuType[]}) => {
  const setMenus = useMenuStore((s) => s.setMenus);

  useEffect(() => {
    setMenus(menus);
  }, [menus, setMenus]);

  return null;
};

export default MenuStoreHydrator;
```

`src/app/page.tsx`:
```tsx
import ErrorBoundary from '@/components/ErrorBoundary';
import MenuBoard from '@/components/board/MenuBoard';
import MenuStoreHydrator from '@/components/board/MenuStoreHydrator';
import HomeSide from '@/components/home/HomeSide';
import {SiteFooter, SiteHeader} from '@/components/site';
import getMenu from '@/lib/api/getMenu';
import dayjs from '@/lib/dayjs';
import {formatYYYYMMDD} from '@/lib/utils';

export const revalidate = 21600;

export default async function Home() {
  const today = dayjs().tz();
  const start = formatYYYYMMDD(today.subtract(1, 'week').startOf('week').add(1, 'day'));
  const end = formatYYYYMMDD(today.add(1, 'week').endOf('week').add(1, 'day'));

  const menus = await getMenu({start, end});

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-[min(880px,calc(100%-40px))]">
        <section className="pt-8 pb-5">
          <span className="inline-block bg-accent-soft px-2.5 py-1 text-xs font-extrabold tracking-wide text-accent-text">
            {today.format('M월 D일 dddd')} · 과천 지식정보타운
          </span>
          <h1 className="mt-3 text-[27px] font-extrabold tracking-tight max-[560px]:text-[22px]">
            오늘{' '}
            <mark className="bg-[linear-gradient(transparent_58%,var(--color-highlight)_58%)] px-1">
              점심
            </mark>
            , 정하셨나요?
          </h1>
        </section>
        <ErrorBoundary>
          <MenuStoreHydrator menus={menus} />
          <div className="grid grid-cols-[1fr_300px] items-stretch gap-6 pb-10 max-[920px]:grid-cols-1">
            <MenuBoard />
            <HomeSide />
          </div>
        </ErrorBoundary>
      </main>
      <SiteFooter />
    </>
  );
}
```

비고: dayjs `dddd` 한국어 요일 — `@/lib/dayjs`에 **`import 'dayjs/locale/ko'` + `dayjs.locale('ko')` + tz 디폴트가 이미 설정됨**(리뷰 #3, 확인만). 추가 작업 불필요.

- [ ] **Step 3: 수동 검증 (목업과 비교)**

Run: `pnpm dev` → http://localhost:3000 을 목업(`docs/design/mockups/home-b.html`, `python3 -m http.server 8943` from mockups dir)과 나란히 비교.
체크: ① 다크 헤더+벨 ② 옐로우 보드 헤더 ③ 날짜 바 7칩(오늘 옐로우) ④ 코스 3행 메뉴+kcal ⑤ 우측 컬럼 하단 라인이 보드와 일치 ⑥ 390px 뷰포트에서 1컬럼 + 메뉴 1뷰

- [ ] **Step 4: 빌드 확인**

Run: `pnpm build`
Expected: 성공 (타입 에러 0)

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx src/components/home/ src/components/board/MenuStoreHydrator.tsx src/lib/dayjs.ts
git commit -m "feat: 홈 재구성 — 히어로 + 메뉴보드 + 우측 진입 컬럼 (880px 반응형)"
```

---

### Task 7: /notice — 공지 + 만든 사람들

목업 기준: `docs/design/mockups/notice.html`. 데이터는 `data/notices.json` (운영자 수동 편집, 무서버).

**Files:**
- Create: `data/notices.json`
- Create: `src/types/notice.ts`
- Create: `src/app/notice/page.tsx`

- [ ] **Step 1: 데이터 + 타입 작성**

`data/notices.json`:
```json
{
  "notices": [
    {
      "id": "2026-06-05-renewal",
      "title": "메가밥스가 새 옷을 입었어요",
      "body": "홈이 메뉴 중심으로 개편됐어요. 내기 게임, 주변 맛집, 식전 픽 투표가 차례로 추가될 예정이에요.",
      "publishedAt": "2026-06-05",
      "isNew": true
    }
  ],
  "makers": [
    {
      "name": "개발자 1",
      "role": "프론트엔드 · 메뉴/투표/게임",
      "email": "dev1@megabobs.com",
      "github": "",
      "slack": ""
    },
    {
      "name": "개발자 2",
      "role": "프론트엔드 · 맛집/블로그/파이프라인",
      "email": "dev2@megabobs.com",
      "github": "",
      "slack": ""
    }
  ]
}
```
⚠️ 이름·이메일은 플레이스홀더 — 배포 전 실제 값으로 교체 (기획 미해결 항목).

`src/types/notice.ts`:
```ts
export type Notice = {
  id: string;
  title: string;
  body: string;
  publishedAt: string;
  isNew: boolean;
};

export type Maker = {
  name: string;
  role: string;
  email: string;
  github: string;
  slack: string;
};

export type NoticeData = {
  notices: Notice[];
  makers: Maker[];
};
```

- [ ] **Step 2: 페이지 작성**

`src/app/notice/page.tsx`:
```tsx
import type {Metadata} from 'next';

import noticeData from '@/../data/notices.json';
import {SiteFooter, SiteHeader} from '@/components/site';
import dayjs from '@/lib/dayjs';
import {NoticeData} from '@/types/notice';

export const metadata: Metadata = {
  title: '공지사항 — 메가밥스',
  description: '메가밥스의 새 기능, 점검, 운영 안내',
};

export default function NoticePage() {
  const {notices, makers} = noticeData as NoticeData;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-[min(880px,calc(100%-40px))]">
        <section className="pt-8 pb-5">
          <span className="inline-block bg-accent-soft px-2.5 py-1 text-xs font-extrabold tracking-wide text-accent-text">
            공지사항
          </span>
          <h1 className="mt-3 text-[27px] font-extrabold tracking-tight">메가밥스 소식</h1>
          <p className="mt-2 text-[15px] text-muted">새 기능, 점검, 운영 안내를 여기서 알려드려요</p>
        </section>

        <div className="flex flex-col">
          {notices.map((n, i) => (
            <article
              key={n.id}
              className={`flex gap-5 border-b border-line px-1 py-5 ${i === 0 ? 'border-t-2 border-t-ink' : ''}`}
            >
              <div className="w-16 shrink-0">
                <b className="block text-[17px] font-extrabold">
                  {dayjs.tz(n.publishedAt).format('M.D')}
                </b>
                <span className="block text-[11px] text-muted">
                  {dayjs.tz(n.publishedAt).format('YYYY')}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="flex items-center gap-2 text-base font-extrabold">
                  {n.title}
                  {n.isNew && (
                    <span className="bg-accent px-1.5 py-0.5 text-[9.5px] font-extrabold text-ink">
                      NEW
                    </span>
                  )}
                </h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-2">{n.body}</p>
              </div>
            </article>
          ))}
        </div>

        <section id="makers" className="mt-11 pb-16">
          <h2 className="border-b-2 border-ink pb-3 text-lg font-extrabold">만든 사람들</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 max-[560px]:grid-cols-1">
            {makers.map((m, i) => (
              <div key={m.name} className="shadow-flat flex gap-4 border border-line bg-surface p-5">
                <span className="flex size-[52px] shrink-0 items-center justify-center bg-accent-soft text-[19px] font-extrabold text-accent-text">
                  D{i + 1}
                </span>
                <div>
                  <h3 className="text-[15.5px] font-extrabold">{m.name}</h3>
                  <p className="mt-0.5 text-xs text-muted">{m.role}</p>
                  <a
                    href={`mailto:${m.email}`}
                    className="mt-2 inline-block border-b border-accent-soft pb-px text-xs font-bold text-accent-text"
                  >
                    {m.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3.5 text-xs leading-relaxed text-muted">
            점심시간을 아껴 만들고 있어요. 버그·아이디어·맛집 제보 모두 환영해요.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
```

비고: `@/../data/notices.json` import는 tsconfig `resolveJsonModule` 필요 — **이미 `tsconfig.json`에 `"resolveJsonModule": true` 설정됨**(리뷰 #3, 확인만). 추가 작업 불필요.

- [ ] **Step 3: 수동 검증 + 빌드**

Run: `pnpm dev` → http://localhost:3000/notice — 목업 `notice.html`과 비교. 풋터 "만든 사람들" 클릭 → `#makers` 앵커 이동 확인.
Run: `pnpm build` → 성공

- [ ] **Step 4: Commit**

```bash
git add data/notices.json src/types/notice.ts src/app/notice/ tsconfig.json
git commit -m "feat: 공지사항 페이지 — 공지 목록 + 만든 사람들"
```

---

### Task 8: 구컴포넌트 제거 + 다크모드 청산

**Files:**
- Delete: `src/components/Header.tsx`, `src/components/MenuSelector.tsx`, `src/components/WeekSelect.tsx`, `src/components/DaySelect.tsx`, `src/components/CourseSelect.tsx`, `src/components/MenuSection.tsx`, `src/components/MenuItem.tsx`, `src/components/ThemeProvider.tsx`, `src/components/ThemeToggle.tsx`, `src/components/ThemeDropdown.tsx`, `src/components/layout/` (AppLayout, MenuContainer, MobileContainer, index.ts 포함)
- Delete(조건부, 리뷰 #5): `src/components/Loading.tsx`, `src/components/ContactButton.tsx`, `src/components/ContactDropdown.tsx` — Step 1 grep으로 미참조 확인 후 삭제
- Delete(리뷰 #2): `tailwind.config.ts` — v3식 레거시 설정(`fontSize.sm=11px`/`base=12px`, 구 컬러, `maxWidth.container=375px`, `darkMode:'class'`)이 v4 `@theme`(globals.css)와 혼선. v4는 `@config` 없이는 이 파일을 읽지 않아 사실상 dormant이므로 제거
- Modify: `package.json` (`next-themes` 제거)

- [ ] **Step 1: 참조 확인**

```bash
grep -rn "MenuSelector\|WeekSelect\|DaySelect\|CourseSelect\|MenuSection\|MenuItem\|AppLayout\|MenuContainer\|MobileContainer\|ThemeProvider\|ThemeToggle\|ThemeDropdown\|next-themes\|components/Header\|components/Loading\|ContactButton\|ContactDropdown" src/ --include='*.tsx' --include='*.ts'
```
Expected: 삭제 대상 파일들 상호 참조만 남아 있어야 함. 외부(신규 코드/API)에서 참조가 나오면 그 참조 먼저 정리. `Loading`/`Contact*`이 어디서도 참조되지 않으면 Step 2에서 함께 삭제, 참조가 있으면 그 파일은 남기고 사유를 커밋 메시지에 기록.

- [ ] **Step 2: 파일 삭제 + 의존성 제거**

```bash
git rm src/components/Header.tsx src/components/MenuSelector.tsx src/components/WeekSelect.tsx \
  src/components/DaySelect.tsx src/components/CourseSelect.tsx src/components/MenuSection.tsx \
  src/components/MenuItem.tsx src/components/ThemeProvider.tsx src/components/ThemeToggle.tsx \
  src/components/ThemeDropdown.tsx
git rm -r src/components/layout
git rm tailwind.config.ts
# 아래는 Step 1에서 미참조로 확인된 경우에만
git rm src/components/Loading.tsx src/components/ContactButton.tsx src/components/ContactDropdown.tsx
pnpm remove next-themes
```

`useMenuStore`의 `category` 상태가 CourseSelect 전용이었다면 함께 정리하되, 플랜 ②(투표)에서 menu_id로 재사용할 수 있으므로 **store는 남긴다**.

주의(리뷰 #2): `tailwind.config.ts` 삭제 후 `pnpm build`로 빌드가 깨지지 않는지 반드시 재확인. 만약 신규 컴포넌트가 `text-sm`/`text-base` 같은 폰트 사이즈 유틸에 의존해 시각이 틀어지면, 해당 토큰을 globals.css `@theme`에 옮기거나 컴포넌트에서 arbitrary value(`text-[11px]`)로 고정.

- [ ] **Step 3: 빌드 + 테스트 + lint 최종 확인**

Run: `pnpm build && pnpm test && pnpm lint`
Expected: 전부 성공

- [ ] **Step 4: 모바일 수동 QA**

Run: `pnpm dev` — 뷰포트 390px: 헤더(워드마크+벨), 1컬럼 메뉴보드(코스+kcal 잘림 없음), 진입 리스트, 풋터. 날짜 바: 지난주 ‹ 두 번 → 토스트("지난 메뉴는 볼 수 없습니다."), 다음 주 › → 메뉴 없으면 COMING UP(목요일 전) 확인.

- [ ] **Step 5: Commit**

```bash
git add -u package.json pnpm-lock.yaml
git commit -m "chore: 구 UI 컴포넌트·다크모드 제거 (리스킨 완료)"
```

---

## Self-Review 체크 결과

- **스펙 커버리지**: 기획 v2 §4.1(메뉴 1뷰·kcal·날짜 네비) → Task 5-6 / §5 IA `/`·`/notice` → Task 6-7 / §5.1 열람·공개 정책 → Task 3 + useDateStore 재사용 / F1 → Task 5 / 디자인 토큰·셸·풋터 → Task 2·4. **투표(F2)·게임(F3)·맛집(F5)·블로그(F6-7)·GA4(F9)는 의도적으로 플랜 ②~⑤ 범위.**
- **플레이스홀더**: 없음 — 모든 스텝에 실제 코드/커맨드 포함. 단 `dev1@megabobs.com` 등은 *데이터* 플레이스홀더로 기획 미해결 항목에 등록돼 있음.
- **타입 일관성**: `MenuType/MenuCategoryLabel`은 기존 정의 재사용. `CAFETERIA/isNextWeek/isNextWeekPublished`는 Task 3 정의 → Task 5에서 동일 시그니처로 사용. `cn`은 Task 4 정의 → Task 5-6에서 사용.
```
