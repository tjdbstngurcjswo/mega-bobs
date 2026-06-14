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
| 유틸리티·도메인 로직 함수                         | `src/lib/<feature>.ts`                         |
| 커스텀 훅                                         | `src/hooks/use<Name>.ts`                       |
| 비레이아웃 스타일 클래스 (아래 기준)              | `<ComponentFolder>/ComponentName.styles.ts`    |

> 여러 컴포넌트가 공유하는 타입·상수는 `src/models/`, `src/constants/`에 둔다.

## 스타일 분리 기준

`className`에 **비레이아웃 클래스**가 하나라도 있으면 해당 className 전체를 `.styles.ts`로 분리한다.

- **레이아웃 → 인라인 유지**: `flex/grid/block`, `w-*/h-*`, `p-*/m-*`, `gap-*`, `items-*/justify-*`, `absolute/relative`, `top-*/left-*`, `z-*`, `overflow-*`
- **비레이아웃 → 반드시 `.styles.ts`**: `text-*(색·크기·굵기)`, `font-*`, `bg-*`, `border-*`, `rounded-*`, `shadow-*`, `opacity-*`, `transition-*`, `animate-*`, `cursor-*`, `hover:*`

```ts
// ✅ 순수 레이아웃 — 인라인 유지
<div className="flex flex-col gap-4 p-6">

// ❌ 비레이아웃 포함 — 인라인 금지
<span className="text-accent text-[13px] font-bold mt-2">

// ✅ .styles.ts에서 export 후 참조
export const labelClass = 'text-accent text-[13px] font-bold mt-2';
// ComponentName.tsx: <span className={labelClass}>

// 조건부 className
export const navLinkClass = (active: boolean) =>
  cn('px-3 py-1.5', active ? 'text-ink font-bold' : 'text-muted');
```

## Import 경로 규칙

| 상황                  | 규칙                     | 예시                              |
| --------------------- | ------------------------ | --------------------------------- |
| **같은 폴더** 내 파일 | 상대경로 `./` 허용       | `'./ComponentName.types'`         |
| **다른 폴더** 참조    | **반드시 `@/` 절대경로** | `'@/lib/utils'`, `'@/types/vote'` |
| `../` 상대경로        | **금지**                 | ❌ `'../lib/utils'`               |

## 체크리스트

- [ ] 컴포넌트 파일에 `interface` / `type` 정의가 없는가?
- [ ] 컴포넌트 함수 바깥에 상수·유틸 함수가 없는가?
- [ ] 비레이아웃 클래스 포함 `className`을 모두 `.styles.ts`로 분리했는가?
- [ ] 분리한 파일이 올바른 위치에 있고 export가 정확한가?
- [ ] 다른 폴더 import가 `@/` 절대경로를 사용하는가? (`../` 없는가?)

## 파일 위치 빠른 참조

```
src/
├── models/       ← 공유 타입
├── constants/    ← 공유 상수
├── hooks/        ← 커스텀 훅
├── lib/          ← 유틸·도메인 로직
└── components/
    └── menu/
        └── MenuBoard/
            ├── index.ts              ← export {default} from './MenuBoard'
            ├── MenuBoard.tsx         ← 컴포넌트 함수만
            ├── MenuBoard.types.ts    ← 전용 타입
            ├── MenuBoard.styles.ts   ← 스타일 (필요 시)
            ├── constants.ts          ← 전용 상수 (필요 시)
            └── _MenuBoardSubName/    ← 외부 비공개 서브컴포넌트
```

## 위반 리포트 형식

```
🚨 Lean Component 위반

| 파일:줄 | 항목 | 이동 대상 |
|---|---|---|
| HeroStatus.tsx:11 | type Status | src/models/menu.ts |
| HeroStatus.tsx:20 | const getStatus | src/lib/hero-status.ts |
```
