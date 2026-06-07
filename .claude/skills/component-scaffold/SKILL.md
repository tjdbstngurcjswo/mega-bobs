---
name: component-scaffold
description: 프로젝트 컨벤션에 맞는 새 컴포넌트·페이지·훅을 생성. "컴포넌트 만들어", "페이지 추가", "훅 만들어" 등 신규 파일 생성 요청 시 발동.
---

# Component Scaffold

새 파일 생성 전 이 절차를 따른다.

## STEP 1: 타입 분류

요청을 아래 중 하나로 분류한다:

| 타입                  | 위치                           | 예시                          |
| --------------------- | ------------------------------ | ----------------------------- |
| **Page**              | `src/app/<route>/page.tsx`     | `/games`, `/nearby`           |
| **Layout**            | `src/app/<route>/layout.tsx`   | 공유 레이아웃                 |
| **Feature Component** | `src/components/<feature>/`    | `VoteButton.tsx`              |
| **Shared Component**  | `src/components/@shared/`      | 전역 공통 UI                  |
| **Hook**              | `src/lib/<name>.ts`            | `useVote.ts`                  |
| **API Route**         | `src/app/api/<route>/route.ts` | → api-route-pattern 스킬 사용 |

## STEP 2: 폴더 구조 생성

**컴포넌트는 반드시 전용 폴더로 생성한다.** 파일 하나로 만들지 않는다.

```
src/components/<domain>/<ComponentName>/
├── index.ts                    ← export {default} from './ComponentName'
├── ComponentName.tsx           ← 컴포넌트 함수만
├── ComponentName.types.ts      ← 이 컴포넌트 전용 Props 타입 (항상 생성)
├── ComponentName.styles.ts     ← 스타일 함수 (필요 시)
└── constants.ts                ← 전용 상수 (필요 시)
```

서브 컴포넌트(외부 미노출)는 `_ParentNameSubName/` 형식의 하위 폴더에 둔다.
**이름 규칙**: `_` + 상위 컴포넌트명 + 서브 컴포넌트명 (예: `MenuBoard` → `_MenuBoardEmpty/MenuBoardEmpty.tsx`).
`index.ts`는 최상위 컴포넌트만 export한다.

**`src/components/` 하위 모든 디렉토리에 `index.ts`가 있어야 한다.** 새 컴포넌트를 추가하면 컴포넌트 폴더·도메인 폴더·`src/components/index.ts` 모두에 export를 추가한다.

```ts
// src/components/board/index.ts
export { default as MenuBoard } from './MenuBoard';
export { default as CourseRow } from './CourseRow';
// ...
```

## STEP 3: 컨벤션 규칙 적용

### 컴포넌트 템플릿

Props 타입 포함 모든 타입·상수·함수는 컴포넌트 파일 밖에 두지 않는다 → `lean-component` 스킬 참조.

```tsx
// 1. 'use client' — 클라이언트 전용일 때만
'use client';

// 2. import 경로 규칙
//    - 같은 폴더 → 상대경로 './'
//    - 다른 폴더 → 반드시 '@/' 절대경로 (../ 금지)
import { useState } from 'react';

import { cn } from '@/lib/utils';
import { ComponentNameProps } from './ComponentName.types';

// 3. arrow function + export default (파일 안에 이것만)
const ComponentName = ({ prop, optional = false }: ComponentNameProps) => {
  // 4. early return
  if (!prop) return null;

  return (
    <div className={cn('base-class', optional && 'optional-class')}>{prop}</div>
  );
};

export default ComponentName;
```

### 훅 템플릿

```ts
'use client';

import { useEffect, useState } from 'react';

export const useHookName = (param: ParamType) => {
  const [state, setState] = useState<StateType>(initial);

  useEffect(() => {
    // ...
  }, [param]);

  return { state };
};
```

### 파일명 규칙

- 컴포넌트 폴더: `PascalCase/`
- 컴포넌트 파일: `PascalCase.tsx`
- 훅/유틸: `camelCase.ts`
- 상수: `UPPER_CASE` (파일명은 `ComponentName.constants.ts`)
- 전용 타입: `ComponentName.types.ts` (폴더 내부)
- 공유 타입: `src/types/<domain>.ts`

## STEP 4: 제약 확인

- **300줄/파일** 초과 예상 시 → 분리 계획 제시 후 진행
- **80줄/함수** 초과 예상 시 → 하위 컴포넌트/함수 추출
- **중첩 depth ≤ 3**: JSX 중첩 포함
- **params ≤ 4**: props가 4개 초과하면 객체로 묶기

## STEP 5: Lean Component 준수 확인

**`lean-component` 스킬을 Read로 읽고 체크리스트를 실행한다. 생략 불가.**

- 컴포넌트 파일에 타입·상수·함수가 남아 있으면 해당 스킬의 분리 기준에 따라 이동
- 스타일 코드가 15줄 초과이면 `ComponentName.styles.ts`로 추출

## STEP 6: 디자인 시스템 적용

컴포넌트에 스타일이 포함되면 `design-system-guard` 스킬의 STEP 2~3 체크를 인라인으로 수행한다.
(별도 스킬 호출 없이 금지 패턴만 확인)

## STEP 7: 생성 후 보고

```
✅ 생성 완료

- 폴더: src/components/<domain>/<ComponentName>/
- 파일: ComponentName.tsx, index.ts, types.ts
- 스타일: ComponentName.styles.ts (생성된 경우)
- 상수: constants.ts (생성된 경우)
- 상위 index: src/components/<domain>/index.ts 업데이트 여부
```
