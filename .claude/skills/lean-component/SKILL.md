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
| `interface XxxProps` / `type Xxx` (props 포함) | `src/types/<domain>.ts` |
| 상수 (`const THRESHOLD = 300` 등) | `src/constants/<domain>.ts` |
| 유틸리티 함수 (`const calcTotal = ...`) | `src/lib/<feature>.ts` |
| 도메인 로직 함수 (`const getStatus = ...`) | `src/lib/<feature>.ts` |
| 커스텀 훅 | `src/lib/hooks/use<Name>.ts` |
| 스타일 상수 (15줄 초과 시) | `<ComponentName>.styles.ts` (컴포넌트와 같은 디렉토리) |

## 분리 기준 상세

### Props 타입
```ts
// ❌ CourseRow.tsx 안에
interface CourseRowProps { menu: MenuType; index?: number; ... }

// ✅ src/types/board.ts 에
export interface CourseRowProps { menu: MenuType; index?: number; ... }
```

### 도메인 로직 함수
```ts
// ❌ HeroStatus.tsx 안에
const getStatus = (menus: MenuType[], now: dayjs.Dayjs): Status => { ... }

// ✅ src/lib/hero-status.ts 에
export const getStatus = (menus: MenuType[], now: dayjs.Dayjs): Status => { ... }
```

### 스타일 (15줄 초과 시)
```ts
// ❌ Component.tsx 안에 긴 cn() 문자열들이 흩어짐

// ✅ Component.styles.ts 에 (같은 디렉토리)
export const styles = {
  root: 'px-5 py-6',
  label: 'text-accent-text text-[13px] font-extrabold tracking-wider',
  button: cn('flex items-center gap-1 ...', ...),
} as const;
```

## 체크리스트 (컴포넌트 작성·수정 후 실행)

- [ ] 컴포넌트 파일에 `interface` / `type` 정의가 없는가?
- [ ] 컴포넌트 함수 바깥에 상수(`const UPPER` 또는 일반 값 상수)가 없는가?
- [ ] 컴포넌트 함수 바깥에 유틸/로직 함수가 없는가?
- [ ] 스타일 관련 코드가 15줄 이상이면 `.styles.ts`로 분리했는가?
- [ ] 분리한 파일이 올바른 위치에 있고 export가 정확한가?
- [ ] 컴포넌트 파일이 import → 컴포넌트 → export default 구조로만 이루어졌는가?

## 파일 위치 빠른 참조

```
src/
├── types/          ← 모든 타입·인터페이스 (도메인별 파일)
├── constants/      ← 앱 전역 상수
├── lib/            ← 유틸 함수, 도메인 로직
│   └── hooks/      ← 커스텀 훅
└── components/
    └── board/
        ├── CourseRow.tsx        ← 컴포넌트만
        └── CourseRow.styles.ts  ← 스타일 상수 (필요 시)
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
