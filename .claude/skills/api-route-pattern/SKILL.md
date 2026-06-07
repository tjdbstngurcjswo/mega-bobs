---
name: api-route-pattern
description: Next.js App Router Route Handler + Supabase + 인증/캐시 패턴으로 새 API 엔드포인트 생성. "API 만들어", "/api/* 추가", "엔드포인트 추가" 요청 시 발동.
---

# API Route Pattern

`src/app/api/` 하위에 새 Route Handler를 만들 때 이 절차를 따른다.

## STEP 1: 기존 라우트 참조

`src/app/api/` 를 확인해 기존 패턴과 일관성을 맞춘다.

## STEP 2: 라우트 유형 분류

| 유형 | 파일 | 특징 |
|---|---|---|
| **Public 조회** | `route.ts` — GET | 인증 없음, ISR/캐시 적용 가능 |
| **인증 필요** | `route.ts` — GET/POST | `MENU_API_KEY` 헤더 검증 |
| **Slack 훅** | `route.ts` — POST | `SLACK_SIGNING_SECRET` 서명 검증 |
| **Cron** | `route.ts` — GET | `Authorization: Bearer` 검증 |
| **Revalidate** | `route.ts` — GET | `?secret=` 쿼리 검증 |

## STEP 3: 템플릿

### 기본 GET (Supabase 조회)

```ts
import {NextRequest, NextResponse} from 'next/server';

import {supabaseServer} from '@/lib/supabase-server';

export const GET = async (req: NextRequest) => {
  const {searchParams} = req.nextUrl;
  const start = searchParams.get('start');
  const end = searchParams.get('end');

  if (!start || !end) {
    return NextResponse.json({error: 'start, end required'}, {status: 400});
  }

  const {data, error} = await supabaseServer
    .from('daily_menu')
    .select('*')
    .gte('date', start)
    .lte('date', end);

  if (error) return NextResponse.json({error: error.message}, {status: 500});

  return NextResponse.json(data);
};
```

### API Key 인증 포함

```ts
const API_KEY = process.env.MENU_API_KEY;

export const GET = async (req: NextRequest) => {
  if (req.headers.get('x-api-key') !== API_KEY) {
    return NextResponse.json({error: 'Unauthorized'}, {status: 401});
  }
  // ...
};
```

### Cron Route

```ts
export const GET = async (req: NextRequest) => {
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({error: 'Unauthorized'}, {status: 401});
  }
  // ...
};
```

## STEP 4: 규칙

- **서버 전용 Supabase**: `supabaseServer` from `@/lib/supabase-server` — 클라이언트용 import 금지
- **환경변수 직접 노출 금지**: `NEXT_PUBLIC_` 접두사 없는 변수는 서버에서만
- **에러 응답 일관성**: `{error: string}` + HTTP 상태 코드
- **GET 핸들러명**: `export const GET = async (req: NextRequest) =>` (named export)
- **Vercel Cron**: `vercel.json`의 `crons` 배열에 등록 필요 (이미 있으면 추가)
