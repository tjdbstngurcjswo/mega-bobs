---
name: lean-component
description: Use when creating, editing, or reviewing any component file (.tsx). Enforces that component files contain only the component function — types, constants, and helper functions outside the component body must be extracted to separate files. Also extracts long style blocks.
---

# Lean Component

컴포넌트 파일 = **컴포넌트 함수 + JSX만**. 그 외 모든 것은 별도 파일로 분리한다.

## 규칙

컴포넌트 파일(`.tsx`)에서 허용되는 것:

- `'use client'` 지시어
- import 구문
- **컴포넌트 함수 하나** (`const Component = () => ...`)
- `export default Component`

컴포넌트 파일에 있어선 안 되는 것:

| 금지 항목                                         | 이동 대상                                      |
| ------------------------------------------------- | ---------------------------------------------- |
| `interface XxxProps` / `type Xxx` (컴포넌트 전용) | `<ComponentFolder>/ComponentName.types.ts`     |
| 상수 (컴포넌트 전용)                              | `<ComponentFolder>/ComponentName.constants.ts` |
| 순수 계산 함수 (기하·수학·알고리즘, React 미사용) | `<ComponentFolder>/ComponentName.geometry.ts`  |
| 유틸리티 함수 (`const calcTotal = ...`)           | `src/lib/<feature>.ts`                         |
| 도메인 로직 함수 (`const getStatus = ...`)        | `src/lib/<feature>.ts`                         |
| 커스텀 훅                                         | `src/hooks/use<Name>.ts`                       |
| 스타일 상수 (아래 기준 충족 시)                   | `<ComponentFolder>/ComponentName.styles.ts`    |

> 여러 컴포넌트에서 공유되는 타입·상수는 `src/models/`, `src/constants/`에 둔다.

## 분리 기준 상세

### Props 타입

```ts
// ❌ CourseRow/CourseRow.tsx 안에
interface CourseRowProps { menu: MenuType; index?: number; ... }

// ✅ CourseRow/CourseRow.types.ts 에
export interface CourseRowProps { menu: MenuType; index?: number; ... }

// ✅ CourseRow/CourseRow.tsx 에서
import {CourseRowProps} from './CourseRow.types';
```

### 도메인 로직 함수

```ts
// ❌ HeroStatus.tsx 안에
const getStatus = (menus: MenuType[], now: dayjs.Dayjs): Status => { ... }

// ✅ src/lib/hero-status.ts 에
export const getStatus = (menus: MenuType[], now: dayjs.Dayjs): Status => { ... }
```

### 스타일 분리 기준

`className`에 **비레이아웃 클래스**가 하나라도 포함되면 `.styles.ts`로 분리한다.

| 레이아웃 클래스 — JSX 인라인 유지 가능                              | 비레이아웃 클래스 — 반드시 `.styles.ts` 분리                |
| ------------------------------------------------------------------- | ----------------------------------------------------------- |
| `flex`, `grid`, `block`, `inline-flex`, `hidden`, `contents`        | `text-*` (색상·크기·굵기·정렬·데코), `font-*`               |
| `flex-*`, `grid-*`, `col-*`, `row-*`                                | `tracking-*`, `leading-*`, `whitespace-*`, `truncate`       |
| `w-*`, `h-*`, `size-*`, `min-w-*`, `max-w-*`, `min-h-*`, `max-h-*`  | `bg-*`                                                      |
| `p-*`, `px-*`, `py-*`, `pt-*`, `pb-*`, `pl-*`, `pr-*`               | `border-*`, `rounded-*`, `divide-*`, `outline-*`, `ring-*`  |
| `m-*`, `mx-*`, `my-*`, `mt-*`, `mb-*`, `ml-*`, `mr-*`               | `shadow-*`                                                  |
| `gap-*`, `space-*`                                                  | `opacity-*`                                                 |
| `items-*`, `justify-*`, `content-*`, `self-*`, `place-*`            | `transition-*`, `duration-*`, `ease-*`, `delay-*`           |
| `absolute`, `relative`, `fixed`, `sticky`, `static`                 | `animate-*`, `scale-*`, `rotate-*`, `translate-*`           |
| `top-*`, `right-*`, `bottom-*`, `left-*`, `inset-*`, `z-*`          | `cursor-*`, `pointer-events-*`, `select-*`, `appearance-*`  |
| `overflow-*`, `shrink-*`, `grow-*`, `basis-*`, `order-*`            | `hover:*`, `active:*`, `group-hover:*` (비레이아웃 대상 시) |
| `aspect-*`                                                          | `sr-only`, `visible`, `invisible`                           |
| 위 레이아웃 클래스에 대한 반응형 접두사 (`max-[920px]:grid-cols-1`) | 비레이아웃에 대한 반응형 접두사 (`max-[640px]:text-sm`)     |

```ts
// ✅ 순수 레이아웃만 — 인라인 유지
<div className="flex flex-col gap-4 p-6">

// ❌ 비레이아웃 포함 — 인라인 금지
<span className="text-accent text-[13px] font-bold mt-2">

// ✅ 비레이아웃이 포함된 경우 — 해당 className 전체를 .styles.ts로
// ComponentName.styles.ts
export const labelClass = 'text-accent text-[13px] font-bold mt-2';

// ComponentName.tsx
<span className={labelClass}>

// 조건부 className — styles.ts에서 함수로
export const navLinkClass = (active: boolean) =>
  cn('px-3 py-1.5', active ? 'text-ink font-bold' : 'text-muted');

// ComponentName.tsx
<a className={navLinkClass(active)}>
```

> 비레이아웃 클래스가 하나라도 있으면 레이아웃 클래스까지 포함해 **className 전체**를 `.styles.ts`로 옮긴다. JSX에는 `className={exportedConst}` 형태만 남긴다.

## Import 경로 규칙

| 상황                  | 규칙                     | 예시                              |
| --------------------- | ------------------------ | --------------------------------- |
| **같은 폴더** 내 파일 | 상대경로 `./ ` 허용      | `'./ComponentName.types'`         |
| **다른 폴더** 참조    | **반드시 `@/` 절대경로** | `'@/lib/utils'`, `'@/types/vote'` |
| `../` 상대경로        | **금지**                 | ❌ `'../lib/utils'`               |

```ts
// ✅ 같은 폴더 — 상대경로 OK
import { MenuBoardProps } from './MenuBoard.types';
import { todayButtonClass } from './MenuBoard.styles';

// ✅ 다른 폴더 — @/ 절대경로
import { cn } from '@/lib/utils';
import { MenuCategory } from '@/types/menu';

// ❌ 절대 금지
import { supabaseServer } from '../lib/supabase-server';
```

## 체크리스트 (컴포넌트 작성·수정 후 실행)

- [ ] 컴포넌트 파일에 `interface` / `type` 정의가 없는가?
- [ ] 컴포넌트 함수 바깥에 상수(`const UPPER` 또는 일반 값 상수)가 없는가?
- [ ] 컴포넌트 함수 바깥에 유틸/로직 함수가 없는가? (순수 계산 함수는 `.geometry.ts`로)
- [ ] 비레이아웃 클래스(`text-*`, `bg-*`, `border-*`, `shadow-*`, `font-*`, `transition-*`, `cursor-*` 등)가 있는 모든 `className`을 `.styles.ts`로 분리했는가?
- [ ] 분리한 파일이 올바른 위치에 있고 export가 정확한가?
- [ ] 다른 폴더 import가 `@/` 절대경로를 사용하는가? (`../` 없는가?)
- [ ] 컴포넌트 파일이 import → 컴포넌트 → export default 구조로만 이루어졌는가?

## 파일 위치 빠른 참조

```
src/
├── models/         ← 여러 컴포넌트가 공유하는 타입 (menu, vote 등)
├── constants/      ← 여러 컴포넌트가 공유하는 상수
├── hooks/          ← 커스텀 훅
├── lib/            ← 유틸 함수, 도메인 로직
└── components/
    └── menu/
        └── MenuBoard/           ← 컴포넌트마다 전용 폴더
            ├── index.ts                 ← export {default} from './MenuBoard'
            ├── MenuBoard.tsx            ← 컴포넌트 함수만
            ├── MenuBoard.types.ts       ← 이 컴포넌트 전용 타입
            ├── MenuBoard.styles.ts      ← 스타일 (필요 시)
            ├── MenuBoard.geometry.ts   ← 순수 계산 함수 (React 미사용, 필요 시)
            ├── MenuBoard.constants.ts  ← 이 컴포넌트 전용 상수 (필요 시)
            └── _ParentNameSubName/     ← 외부 비공개 서브 컴포넌트 (필요 시)
                                         이름 규칙: 상위 컴포넌트명 + 서브 컴포넌트명
                                         예) MenuBoard → _MenuBoardEmpty/
                                         파일 vs 폴더: 서브 컴포넌트에 types/styles가 필요하면 폴더, 단순 JSX면 파일
```

## 위반 리포트 형식

```
🚨 Lean Component 위반

| 파일:줄 | 항목 | 이동 대상 |
|---|---|---|
| HeroStatus.tsx:11 | type Status | src/types/menu.ts |
| HeroStatus.tsx:13 | const nextWorkdayKey | src/lib/hero-status.ts |
| HeroStatus.tsx:20 | const getStatus | src/lib/hero-status.ts |
```
