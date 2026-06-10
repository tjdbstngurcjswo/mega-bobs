---
name: component-scaffold
description: 프로젝트 컨벤션에 맞는 새 컴포넌트·페이지·훅을 생성. "컴포넌트 만들어", "페이지 추가", "훅 만들어" 등 신규 파일 생성 요청 시 발동.
---

# Component Scaffold

새 파일 생성 전 이 절차를 따른다.

## STEP 1: 타입 분류

| 타입                  | 위치                           |
| --------------------- | ------------------------------ |
| **Page**              | `src/app/<route>/page.tsx`     |
| **Feature Component** | `src/components/<feature>/`    |
| **Shared Component**  | `src/components/@shared/`      |
| **Hook**              | `src/hooks/<name>.ts`          |
| **API Route**         | → `api-route-pattern` 스킬 사용 |

## STEP 2: 폴더 구조 생성

컴포넌트는 반드시 전용 폴더로 생성한다 (단일 파일 금지):

```
src/components/<domain>/<ComponentName>/
├── index.ts                    ← export {default} from './ComponentName'
├── ComponentName.tsx           ← 컴포넌트 함수만
├── ComponentName.types.ts      ← 전용 Props 타입 (항상 생성)
├── ComponentName.styles.ts     ← 스타일 (필요 시)
└── constants.ts                ← 전용 상수 (필요 시)
```

서브 컴포넌트(외부 미노출)는 `_ParentNameSubName/` 하위 폴더. 예: `MenuBoard` → `_MenuBoardEmpty/`.
`src/components/` 하위 모든 디렉토리 `index.ts`에 export 추가 필수.

## STEP 3: 컨벤션 규칙

```tsx
'use client'; // 클라이언트 전용일 때만

import { cn } from '@/lib/utils';

import { ComponentNameProps } from './ComponentName.types';

const ComponentName = ({ prop, optional = false }: ComponentNameProps) => {
  if (!prop) return null;
  return <div className={cn('base', optional && 'opt')}>{prop}</div>;
};

export default ComponentName;
```

```ts
// 훅
export const useHookName = (param: ParamType) => {
  const [state, setState] = useState<StateType>(initial);
  useEffect(() => { /* ... */ }, [param]);
  return { state };
};
```

**파일명**: 컴포넌트·폴더 `PascalCase` / 훅·유틸 `camelCase` / 타입 `ComponentName.types.ts` / 상수 `ComponentName.constants.ts`

## STEP 4: 제약

300줄/파일 · 80줄/함수 · 중첩 depth ≤ 3 · props ≤ 4 초과 시 분리 계획 제시 후 진행.

## STEP 5: Lean Component 준수

`lean-component` 스킬 체크리스트 실행 — 생략 불가.

## STEP 6: 디자인 시스템

스타일이 포함되면 `design-system-guard` STEP 2~3 체크를 인라인으로 수행.
