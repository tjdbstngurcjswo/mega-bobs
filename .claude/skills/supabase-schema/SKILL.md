---
name: supabase-schema
description: Supabase 테이블 신규 생성·마이그레이션·RLS 정책·TypeScript 타입 레이어 작업. "테이블 만들어", "스키마 추가", "Supabase 설정" 요청 시 발동.
---

# Supabase Schema

새 테이블이나 스키마 변경 시 이 절차를 따른다.

## STEP 1: 기존 패턴 참조

`src/lib/supabaseServer.ts` 와 `src/models/` 를 읽어 기존 타입·클라이언트 패턴을 파악한다.

## STEP 2: SQL 마이그레이션 작성

```sql
create table if not exists public.votes (
  id         uuid primary key default gen_random_uuid(),
  date       date        not null,
  category   text        not null,
  voter_id   text        not null,
  created_at timestamptz not null default now()
);

create unique index if not exists votes_dedup
  on public.votes (date, category, voter_id);

alter table public.votes enable row level security;

create policy "anon insert" on public.votes
  for insert to anon with check (true);

create policy "select aggregate" on public.votes
  for select to anon using (true);
```

## STEP 3: TypeScript 타입 추가

`src/models/` 하위에 도메인별 파일 추가:

```ts
// src/models/vote.ts
export type VoteCategory = 'course1' | 'course2' | 'takeout';

export interface Vote {
  id: string;
  date: string;
  category: VoteCategory;
  voter_id: string;
  created_at: string;
}
```

## STEP 4: 쿼리 함수 추가

`src/api/` 하위에 작성:

```ts
// src/api/getVotes.ts
import { supabaseServer } from '@/lib/supabaseServer';
import { VoteCategory } from '@/models/vote';

export const getVoteSummary = async (date: string) => {
  const { data, error } = await supabaseServer
    .from('votes')
    .select('category, count:id.count()')
    .eq('date', date);
  if (error) throw new Error(error.message);
  return data ?? [];
};
```

## STEP 5: 체크리스트

- [ ] SQL 마이그레이션 작성 (Supabase 대시보드 > SQL Editor)
- [ ] RLS 정책 활성화 확인
- [ ] TypeScript 타입 추가 (`src/models/`)
- [ ] 쿼리 함수 추가 (`src/api/`)
- [ ] 환경변수 추가 필요 여부 확인

## STEP 6: RLS 원칙

- **anon**: INSERT only (투표, 이벤트 로깅)
- **authenticated**: SELECT + UPDATE (관리자)
- **service_role**: 제한 없음 (Cron, 서버사이드)
- voter_id 등 식별 필드는 SELECT 정책에서 집계로만 노출
