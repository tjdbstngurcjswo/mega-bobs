# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MegaBobs is a cafeteria menu viewer for Megazone employees. It provides a web interface and Slack bot integration to browse daily meals by date and course type. Built with Next.js 15 (App Router), deployed on Vercel, backed by Supabase PostgreSQL.

## Commands

```bash
pnpm dev            # Dev server with Turbopack
pnpm build          # Production build
pnpm lint           # ESLint check
pnpm lint:fix       # ESLint auto-fix
pnpm format         # Prettier format
pnpm format:check   # Prettier check only
```

No test framework is configured.

## Architecture

### Data Flow

Supabase `daily_menu` table → server-side fetch in `page.tsx` (ISR, 6h revalidation) → passed to `MenuSelector` client component → Zustand stores → UI components.

### Key Directories

- `src/app/` — Next.js App Router pages and API routes
- `src/components/` — React components (`layout/` for structural, rest are feature components)
- `src/lib/` — Supabase client (`supabase-server.ts`), data fetching (`api/getMenu.ts`), utilities (`utils.ts`, `dayjs.ts`)
- `src/store/` — Zustand stores: `useMenuStore` (menus, category), `useDateStore` (selected date, week navigation)
- `src/types/` — TypeScript types (`MenuType`, `MenuCategory`, `MealType`, `MenuItemType`)
- `src/constants/` — Constants for menu categories, meal types, Slack commands

### API Routes

- `GET /api/menu?start=&end=` — Query menus by date range
- `POST /api/slack` — Slack slash command handler (오늘/내일/모레/글피)
- `GET /api/slack/warm` — Cron-triggered cache warming (daily 15:00)
- `GET /api/revalidate?secret=` — ISR revalidation trigger (daily 19:30)

### State Management

Two Zustand stores manage client state:
- `useMenuStore` — loaded menus array, selected `MenuCategory` (COURSE_1, COURSE_2, TAKE_OUT)
- `useDateStore` — today, selectedDate, currentWeek (Dayjs[]), min/max date bounds, week navigation

### Timezone

All date logic uses `dayjs` configured with `Asia/Seoul` timezone (`src/lib/dayjs.ts`). Always import dayjs from this module, not directly from the package.

## Code Conventions

### Style Rules (from .cursor/rules and ESLint)

- **Arrow functions**: Always use arrow functions for components and modules, with `export default`
- **Early returns**: Prefer early returns for readability
- **Const over function**: Use `const fn = () =>` instead of `function fn()`
- **Naming**: camelCase for variables/functions, PascalCase for components/types, UPPER_CASE for constants
- **Unused vars**: Prefix with `_` (e.g., `_req`)
- **Import order**: builtin → external → internal → parent → sibling → index, with blank lines between groups, alphabetized
- **Max constraints**: 300 lines/file, 80 lines/function, complexity ≤ 10, nesting ≤ 3, params ≤ 4

### Prettier

Single quotes, no bracket spacing (`{foo}`), trailing commas (es5), 2-space indent, Tailwind CSS plugin for class sorting.

### Styling

Tailwind CSS with custom theme tokens defined in `tailwind.config.ts`. Dark mode via `next-themes` (class-based). Mobile-first design with `maxWidth.container: 375px`.

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase client
- `SUPABASE_SERVICE_ROLE_KEY` — Server-only Supabase admin key
- `REVALIDATE_SECRET` — ISR revalidation auth
- `NEXT_PUBLIC_SITE_URL` — Deployed site URL
