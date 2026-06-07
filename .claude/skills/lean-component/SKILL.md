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

| 금지 항목 | 이동 대상 |
|---|---|
| `interface XxxProps` / `type Xxx` (컴포넌트 전용) | `<ComponentFolder>/ComponentName.types.ts` |
| 상수 (컴포넌트 전용) | `<ComponentFolder>/constants.ts` |
| 유틸리티 함수 (`const calcTotal = ...`) | `src/lib/<feature>.ts` |
| 도메인 로직 함수 (`const getStatus = ...`) | `src/lib/<feature>.ts` |
| 커스텀 훅 | `src/lib/hooks/use<Name>.ts` |
| 스타일 상수 (아래 기준 충족 시) | `<ComponentFolder>/ComponentName.styles.ts` |

> 여러 컴포넌트에서 공유되는 타입·상수는 `src/types/`, `src/constants/`에 둔다.

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

다음 중 하나라도 해당하면 `.styles.ts`로 분리한다:

| 기준 | 설명 |
|---|---|
| **2줄 이상** | className 값이 여러 줄에 걸친 `cn()` 호출 |
| **5회 이상 반복** | 동일하거나 유사한 className 패턴이 컴포넌트 내에서 5회 이상 등장 |

```ts
// ❌ Component.tsx — 2줄 이상 cn()이 JSX 안에 흩어짐
<div className={cn(
  'flex items-center gap-2',
  active && 'text-ink',
)} />

// ✅ Component.styles.ts 에 함수 또는 상수로 분리
export const itemClass = (active: boolean) =>
  cn('flex items-center gap-2', active && 'text-ink');

// ✅ Component.tsx — 깔끔
<div className={itemClass(active)} />
```

단, 단순 한 줄 static 문자열(`'px-4 py-2 text-sm'`)은 인라인 유지해도 무방.

## 체크리스트 (컴포넌트 작성·수정 후 실행)

- [ ] 컴포넌트 파일에 `interface` / `type` 정의가 없는가?
- [ ] 컴포넌트 함수 바깥에 상수(`const UPPER` 또는 일반 값 상수)가 없는가?
- [ ] 컴포넌트 함수 바깥에 유틸/로직 함수가 없는가?
- [ ] 2줄 이상 `cn()` 또는 5회 이상 반복 스타일 패턴을 `.styles.ts`로 분리했는가?
- [ ] 분리한 파일이 올바른 위치에 있고 export가 정확한가?
- [ ] 컴포넌트 파일이 import → 컴포넌트 → export default 구조로만 이루어졌는가?

## 파일 위치 빠른 참조

```
src/
├── types/          ← 여러 컴포넌트가 공유하는 타입 (menu, vote 등)
├── constants/      ← 여러 컴포넌트가 공유하는 상수
├── lib/            ← 유틸 함수, 도메인 로직
│   └── hooks/      ← 커스텀 훅
└── components/
    └── board/
        └── CourseRow/           ← 컴포넌트마다 전용 폴더
            ├── index.ts                 ← export {default} from './CourseRow'
            ├── CourseRow.tsx            ← 컴포넌트 함수만
            ├── CourseRow.types.ts       ← 이 컴포넌트 전용 타입
            ├── CourseRow.styles.ts      ← 스타일 (필요 시)
            ├── constants.ts             ← 이 컴포넌트 전용 상수 (필요 시)
            └── SubComponent.tsx         ← 비공개 서브 컴포넌트 (필요 시)
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
