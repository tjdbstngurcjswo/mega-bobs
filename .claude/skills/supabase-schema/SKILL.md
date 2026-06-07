---
name: supabase-schema
description: Supabase 테이블 신규 생성·마이그레이션·RLS 정책·TypeScript 타입 레이어 작업. "테이블 만들어", "스키마 추가", "Supabase 설정" 요청 시 발동.
---

# Supabase Schema

새 테이블이나 스키마 변경 시 이 절차를 따른다.
작업 티켓은 https://app.notion.com/p/pionari/377cb4f84b7f8012ad8cca1ca0bfad59 에서 관리한다.

## STEP 1: 기존 패턴 참조

`src/lib/supabase-server.ts` 와 `src/types/` 를 읽어 기존 타입·클라이언트 패턴을 파악한다.

## STEP 2: SQL 마이그레이션 작성

```sql
-- 예시: votes 테이블
create table if not exists public.votes (
  id          uuid primary key default gen_random_uuid(),
  date        date        not null,
  category    text        not null, -- 'course1' | 'course2' | 'takeout'
  voter_id    text        not null, -- 익명 ID (GA cookie / localStorage)
  created_at  timestamptz not null default now()
);

-- 중복 투표 방지 (같은 날·코스·투표자)
create unique index if not exists votes_dedup
  on public.votes (date, category, voter_id);

-- RLS 활성화
alter table public.votes enable row level security;

-- 정책: 익명 사용자 INSERT만 허용
create policy "anon insert" on public.votes
  for insert to anon with check (true);

-- 정책: 집계 조회 허용 (개별 voter_id 노출 없이)
create policy "select aggregate" on public.votes
  for select to anon using (true);
```

## STEP 3: TypeScript 타입 추가

`src/types/` 하위에 도메인별 파일 추가:

```ts
// src/types/vote.ts
export type VoteCategory = 'course1' | 'course2' | 'takeout';

export interface Vote {
  id: string;
  date: string; // YYYY-MM-DD
  category: VoteCategory;
  voter_id: string;
  created_at: string;
}

export interface VoteSummary {
  category: VoteCategory;
  count: number;
}
```

## STEP 4: 서버사이드 쿼리 함수 추가

`src/lib/api/` 하위에 쿼리 함수 작성:

```ts
// src/lib/api/getVotes.ts
import { supabaseServer } from '@/lib/supabase-server';
import { VoteSummary } from '@/types/vote';

export const getVoteSummary = async (date: string): Promise<VoteSummary[]> => {
  const { data, error } = await supabaseServer
    .from('votes')
    .select('category, count:id.count()')
    .eq('date', date);

  if (error) throw new Error(error.message);
  return (data ?? []) as VoteSummary[];
};
```

## STEP 5: 체크리스트

- [ ] SQL 마이그레이션 작성 (Supabase 대시보드 > SQL Editor에서 실행)
- [ ] RLS 정책 활성화 확인
- [ ] TypeScript 타입 추가
- [ ] 쿼리 함수 추가
- [ ] 환경변수 추가 필요 여부 확인 (`SUPABASE_SERVICE_ROLE_KEY` 필요 시)
- [ ] Notion 티켓 상태 → Done 업데이트

## STEP 6: RLS 원칙

- **anon**: INSERT only (투표, 이벤트 로깅)
- **authenticated**: SELECT + UPDATE (관리자 작업)
- **service_role**: 제한 없음 (Cron, 서버사이드 집계)
- voter_id 등 개인 식별 가능 필드는 SELECT 정책에서 집계로만 노출
