---
name: component-scaffold
description: 프로젝트 컨벤션에 맞는 새 컴포넌트·페이지·훅을 생성. "컴포넌트 만들어", "페이지 추가", "훅 만들어" 등 신규 파일 생성 요청 시 발동.
---

# Component Scaffold

새 파일 생성 전 이 절차를 따른다.

## STEP 1: 타입 분류

요청을 아래 중 하나로 분류한다:

| 타입 | 위치 | 예시 |
|---|---|---|
| **Page** | `src/app/<route>/page.tsx` | `/games`, `/nearby` |
| **Layout** | `src/app/<route>/layout.tsx` | 공유 레이아웃 |
| **Feature Component** | `src/components/<feature>/` | `VoteButton.tsx` |
| **Shared Component** | `src/components/@shared/` | 전역 공통 UI |
| **Hook** | `src/lib/<name>.ts` | `useVote.ts` |
| **API Route** | `src/app/api/<route>/route.ts` | → api-route-pattern 스킬 사용 |

## STEP 2: 컨벤션 규칙 적용

### 컴포넌트 템플릿

```tsx
// 1. 'use client' — 클라이언트 전용일 때만
'use client';

// 2. import 순서: builtin → external → internal → parent → sibling
import {useState} from 'react';

import {cn} from '@/lib/utils';
import {SomeType} from '@/types/menu';

// 3. 타입은 파일 상단 interface/type으로
interface ComponentNameProps {
  prop: string;
  optional?: boolean;
}

// 4. arrow function + export default
const ComponentName = ({prop, optional = false}: ComponentNameProps) => {
  // 5. early return
  if (!prop) return null;

  return (
    <div className={cn('base-class', optional && 'optional-class')}>
      {prop}
    </div>
  );
};

export default ComponentName;
```

### 훅 템플릿

```ts
'use client';

import {useEffect, useState} from 'react';

export const useHookName = (param: ParamType) => {
  const [state, setState] = useState<StateType>(initial);

  useEffect(() => {
    // ...
  }, [param]);

  return {state};
};
```

### 파일명 규칙

- 컴포넌트: `PascalCase.tsx`
- 훅/유틸: `camelCase.ts`
- 상수: `UPPER_CASE` (파일명은 camelCase)
- 타입 파일: `src/types/<domain>.ts`

## STEP 3: 제약 확인

- **300줄/파일** 초과 예상 시 → 분리 계획 제시 후 진행
- **80줄/함수** 초과 예상 시 → 하위 컴포넌트/함수 추출
- **중첩 depth ≤ 3**: JSX 중첩 포함
- **params ≤ 4**: props가 4개 초과하면 객체로 묶기

## STEP 4: 디자인 시스템 적용

컴포넌트에 스타일이 포함되면 `design-system-guard` 스킬의 STEP 2~3 체크를 인라인으로 수행한다.
(별도 스킬 호출 없이 금지 패턴만 확인)

## STEP 5: 생성 후 보고

```
✅ 생성 완료

- 파일: src/components/feature/ComponentName.tsx
- 타입: src/types/domain.ts (필요 시)
- export: index.ts 업데이트 필요 여부
```
