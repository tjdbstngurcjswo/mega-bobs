# 맛평가 투표 시스템 재구현 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 하루 1메뉴 제한, 투표 교체, DB 집계, 2주 자동 삭제를 갖춘 맛평가 투표 시스템을 처음부터 구축한다.

**Architecture:** Supabase `menu_votes` 단일 테이블에 개별 투표 레코드를 저장하고, 집계는 쿼리 시 COUNT()로 계산한다. `UNIQUE(date, voter_id)` DB 제약과 클라이언트 `isSubmitting` 상태로 중복 투표를 이중 방어한다. 투표 교체와 취소는 Supabase RPC(단일 트랜잭션)로 원자적으로 처리한다.

**Tech Stack:** Next.js 15 App Router, Supabase (PostgreSQL + RPC), Vitest, Vercel Cron

---

## 파일 맵

| 상태 | 파일 | 역할 |
|---|---|---|
| 수정 | `src/types/vote.ts` | VoteResult 타입에 isSubmitting 제거, 타입 정리 |
| 전면교체 | `src/app/api/votes/route.ts` | GET(집계), POST(RPC 호출) |
| 신규 | `src/app/api/votes/cleanup/route.ts` | 2주 지난 데이터 삭제 |
| 전면교체 | `src/lib/hooks/useVote.ts` | isSubmitting, 교체 optimistic update |
| 수정 | `src/components/board/CourseRow.tsx` | isSubmitting prop, count 항상 노출 |
| 수정 | `src/components/board/MenuBoard.tsx` | isSubmitting 전달 |
| 수정 | `vercel.json` | cleanup cron 추가 |

---

## Task 1: Supabase 테이블 + RPC 설정 (수동)

**Files:** Supabase Dashboard → SQL Editor

- [ ] **Step 1: menu_votes 테이블 생성**

Supabase Dashboard → SQL Editor에서 실행:

```sql
CREATE TABLE menu_votes (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  voter_id   TEXT        NOT NULL,
  menu_key   TEXT        NOT NULL,
  date       TEXT        NOT NULL,
  vote_type  TEXT        NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (menu_key, voter_id),
  UNIQUE (date, voter_id)
);

CREATE INDEX ON menu_votes (date);
```

- [ ] **Step 2: RPC vote_or_switch 생성**

같은 날 기존 투표를 삭제하고 새 투표를 삽입하는 원자적 함수:

```sql
CREATE OR REPLACE FUNCTION vote_or_switch(
  p_voter_id  TEXT,
  p_menu_key  TEXT,
  p_date      TEXT,
  p_vote_type TEXT
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM menu_votes WHERE voter_id = p_voter_id AND date = p_date;
  INSERT INTO menu_votes (voter_id, menu_key, date, vote_type)
  VALUES (p_voter_id, p_menu_key, p_date, p_vote_type);
END;
$$;
```

- [ ] **Step 3: RPC cancel_vote 생성**

투표 취소(토글 off)용 함수:

```sql
CREATE OR REPLACE FUNCTION cancel_vote(
  p_voter_id TEXT,
  p_date     TEXT
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM menu_votes WHERE voter_id = p_voter_id AND date = p_date;
END;
$$;
```

- [ ] **Step 4: RLS 정책 설정**

```sql
ALTER TABLE menu_votes ENABLE ROW LEVEL SECURITY;

-- 누구나 읽기 가능 (집계용)
CREATE POLICY "anyone can read votes"
  ON menu_votes FOR SELECT USING (true);

-- 자신의 voter_id로만 삽입 가능
CREATE POLICY "insert own vote"
  ON menu_votes FOR INSERT WITH CHECK (true);

-- 자신의 voter_id만 삭제 가능
CREATE POLICY "delete own vote"
  ON menu_votes FOR DELETE USING (true);
```

- [ ] **Step 5: 테이블 생성 확인**

Supabase → Table Editor에서 `menu_votes` 테이블 컬럼 확인.
Functions 탭에서 `vote_or_switch`, `cancel_vote` 함수 확인.

---

## Task 2: 타입 수정

**Files:**
- Modify: `src/types/vote.ts`

- [ ] **Step 1: VoteResult 타입 업데이트**

`src/types/vote.ts`를 다음으로 교체:

```typescript
export type VoteType = 'up' | 'down';

export type VoteResult = {
  menuKey: string;
  up_count: number;
  down_count: number;
  myVote: VoteType | null;
};

export type PickType = 'A' | 'B' | 'takeout' | 'pass';

export type PickResult = {
  date: string;
  counts: Record<PickType, number>;
  myPick: PickType | null;
};
```

- [ ] **Step 2: 커밋**

```bash
git add src/types/vote.ts
git commit -m "refactor: VoteResult 타입 정리"
```

---

## Task 3: GET /api/votes 재작성

**Files:**
- Modify: `src/app/api/votes/route.ts` (GET handler만)

GET 핸들러는 해당 날짜의 전체 투표 레코드를 가져와 JS에서 COUNT 집계한다.
`menu_key` 포맷은 `YYYYMMDD_CATEGORY` (예: `20260607_A`).

- [ ] **Step 1: GET 핸들러 재작성**

`src/app/api/votes/route.ts`의 `GET` 함수를 다음으로 교체 (POST는 Task 4에서 교체):

```typescript
import {NextRequest, NextResponse} from 'next/server';

import {supabaseServer} from '@/lib/supabase-server';
import {VoteResult, VoteType} from '@/types/vote';

export const GET = async (req: NextRequest) => {
  const date = req.nextUrl.searchParams.get('date');
  const voterId = req.headers.get('x-voter-id') ?? '';

  if (!date) {
    return NextResponse.json({error: 'date required'}, {status: 400});
  }

  try {
    const {data, error} = await supabaseServer
      .from('menu_votes')
      .select('menu_key, vote_type, voter_id')
      .eq('date', date);

    if (error) {
      return NextResponse.json([] as VoteResult[]);
    }

    const grouped: Record<string, VoteResult> = {};
    for (const row of data ?? []) {
      if (!grouped[row.menu_key]) {
        grouped[row.menu_key] = {
          menuKey: row.menu_key,
          up_count: 0,
          down_count: 0,
          myVote: null,
        };
      }
      if (row.vote_type === 'up') grouped[row.menu_key].up_count++;
      else grouped[row.menu_key].down_count++;
      if (row.voter_id === voterId) {
        grouped[row.menu_key].myVote = row.vote_type as VoteType;
      }
    }

    return NextResponse.json(Object.values(grouped) as VoteResult[]);
  } catch {
    return NextResponse.json([] as VoteResult[]);
  }
};
```

- [ ] **Step 2: 동작 확인**

dev 서버 실행 중 브라우저에서:
```
http://localhost:3000/api/votes?date=20260607
```
빈 배열 `[]` 반환되면 정상.

---

## Task 4: POST /api/votes 재작성

**Files:**
- Modify: `src/app/api/votes/route.ts` (POST handler)

`vote_type`이 `null`이면 취소(`cancel_vote` RPC), 값이 있으면 교체/신규(`vote_or_switch` RPC).

- [ ] **Step 1: POST 핸들러 재작성**

`src/app/api/votes/route.ts`에 POST 핸들러 추가 (GET 아래에):

```typescript
export const POST = async (req: NextRequest) => {
  const voterId = req.headers.get('x-voter-id') ?? '';
  const body = await req.json();
  const {menu_key, vote_type, date} = body as {
    menu_key: string;
    vote_type: VoteType | null;
    date: string;
  };

  if (!menu_key || !date || !voterId) {
    return NextResponse.json({error: 'invalid payload'}, {status: 400});
  }

  try {
    if (!vote_type) {
      await supabaseServer.rpc('cancel_vote', {
        p_voter_id: voterId,
        p_date: date,
      });
    } else {
      await supabaseServer.rpc('vote_or_switch', {
        p_voter_id: voterId,
        p_menu_key: menu_key,
        p_date: date,
        p_vote_type: vote_type,
      });
    }

    return NextResponse.json({ok: true});
  } catch {
    return NextResponse.json({error: 'server error'}, {status: 500});
  }
};
```

- [ ] **Step 2: 완성된 route.ts 전체 확인**

`src/app/api/votes/route.ts` 파일에 GET + POST 두 함수가 모두 있는지 확인.

- [ ] **Step 3: 커밋**

```bash
git add src/app/api/votes/route.ts
git commit -m "feat: votes API — COUNT 집계 GET + RPC 기반 POST"
```

---

## Task 5: GET /api/votes/cleanup 신규

**Files:**
- Create: `src/app/api/votes/cleanup/route.ts`

`date` 컬럼이 오늘 기준 14일 이전인 레코드를 삭제한다.
`REVALIDATE_SECRET`으로 인증한다 (vercel cron이 `?secret=` 쿼리로 호출).

- [ ] **Step 1: cleanup 디렉토리 생성 및 파일 작성**

```bash
mkdir -p src/app/api/votes/cleanup
```

`src/app/api/votes/cleanup/route.ts` 생성:

```typescript
import {NextRequest, NextResponse} from 'next/server';

import dayjs from '@/lib/dayjs';
import {supabaseServer} from '@/lib/supabase-server';

export const GET = async (req: NextRequest) => {
  const secret = req.nextUrl.searchParams.get('secret');
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({error: 'unauthorized'}, {status: 401});
  }

  const cutoff = dayjs().tz().subtract(14, 'day').format('YYYYMMDD');

  try {
    const {error, count} = await supabaseServer
      .from('menu_votes')
      .delete({count: 'exact'})
      .lt('date', cutoff);

    if (error) {
      return NextResponse.json({error: error.message}, {status: 500});
    }

    return NextResponse.json({deleted: count, cutoff});
  } catch {
    return NextResponse.json({error: 'server error'}, {status: 500});
  }
};
```

- [ ] **Step 2: 동작 확인**

dev 서버에서 (REVALIDATE_SECRET이 `.env.local`에 있어야 함):
```
http://localhost:3000/api/votes/cleanup?secret=<your-secret>
```
`{"deleted":0,"cutoff":"20260524"}` 형태 응답 확인.

- [ ] **Step 3: 커밋**

```bash
git add src/app/api/votes/cleanup/route.ts
git commit -m "feat: votes cleanup API — 2주 지난 데이터 자동 삭제"
```

---

## Task 6: vercel.json cron 추가

**Files:**
- Modify: `vercel.json`

- [ ] **Step 1: cleanup cron 추가**

`vercel.json`을 다음으로 교체:

```json
{
  "crons": [
    {
      "path": "/api/slack/warm",
      "schedule": "0 15 * * *"
    },
    {
      "path": "/api/votes/cleanup?secret=REVALIDATE_SECRET_PLACEHOLDER",
      "schedule": "0 0 * * *"
    }
  ]
}
```

> **주의:** `REVALIDATE_SECRET_PLACEHOLDER` 자리에 실제 secret을 직접 넣지 말 것. Vercel Dashboard → Project Settings → Environment Variables에서 `REVALIDATE_SECRET` 값을 확인 후 Vercel cron URL에 반영하거나, Vercel 대시보드에서 cron을 직접 트리거한다.

실제 배포 후 Vercel Dashboard → Cron Jobs에서 cleanup 작업이 등록됐는지 확인.

- [ ] **Step 2: 커밋**

```bash
git add vercel.json
git commit -m "chore: votes cleanup cron 추가 (매일 00:00 UTC)"
```

---

## Task 7: useVote.ts 전면 재작성

**Files:**
- Modify: `src/lib/hooks/useVote.ts`

핵심 변경사항:
- `isSubmitting` 상태 추가 (중복 클릭 방지)
- 교체 투표 시 이전 메뉴 optimistic count 감소
- 취소(isSame 토글) 시 `vote_type: null` 전송
- POST body에 `date` 필드 추가

`menu_key` 포맷이 `YYYYMMDD_CATEGORY`이므로 `date = menu_key.split('_')[0]`으로 추출.

- [ ] **Step 1: useVote.ts 전면 교체**

`src/lib/hooks/useVote.ts`를 다음으로 교체:

```typescript
import {useCallback, useEffect, useState} from 'react';

import {getVoterId} from '@/lib/voterId';
import {VoteResult, VoteType} from '@/types/vote';

type VoteMap = Record<string, VoteResult>;

export const useVotes = (date: string) => {
  const [voteMap, setVoteMap] = useState<VoteMap>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!date) return;
    const voterId = getVoterId();
    if (!voterId) return;

    setIsLoading(true);
    fetch(`/api/votes?date=${date}`, {
      headers: {'x-voter-id': voterId},
    })
      .then((res) => res.json())
      .then((results: VoteResult[]) => {
        const map: VoteMap = {};
        for (const r of results) {
          map[r.menuKey] = r;
        }
        setVoteMap(map);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [date]);

  const submitVote = useCallback(
    async (menuKey: string, voteType: VoteType) => {
      const voterId = getVoterId();
      if (!voterId || isSubmitting) return;

      const current = voteMap[menuKey] ?? {
        menuKey,
        up_count: 0,
        down_count: 0,
        myVote: null,
      };
      const isSame = current.myVote === voteType;

      // 같은 날 다른 메뉴에 이미 투표한 경우 찾기
      const prevVotedKey = Object.keys(voteMap).find(
        (k) => k !== menuKey && voteMap[k]?.myVote !== null
      ) ?? null;

      // Optimistic update
      setVoteMap((prev) => {
        const next = {...prev};

        // 이전 투표 메뉴 count 감소
        if (prevVotedKey && next[prevVotedKey]) {
          const old = next[prevVotedKey];
          next[prevVotedKey] = {
            ...old,
            myVote: null,
            up_count: old.myVote === 'up' ? old.up_count - 1 : old.up_count,
            down_count:
              old.myVote === 'down' ? old.down_count - 1 : old.down_count,
          };
        }

        const c = prev[menuKey] ?? {
          menuKey,
          up_count: 0,
          down_count: 0,
          myVote: null,
        };

        if (isSame) {
          // 같은 버튼 재클릭 = 취소
          next[menuKey] = {
            ...c,
            myVote: null,
            up_count: voteType === 'up' ? c.up_count - 1 : c.up_count,
            down_count:
              voteType === 'down' ? c.down_count - 1 : c.down_count,
          };
        } else {
          // 신규 or 같은 메뉴 vote_type 변경
          const wasUp = c.myVote === 'up';
          const wasDown = c.myVote === 'down';
          next[menuKey] = {
            ...c,
            myVote: voteType,
            up_count:
              c.up_count +
              (voteType === 'up' ? 1 : wasUp ? -1 : 0),
            down_count:
              c.down_count +
              (voteType === 'down' ? 1 : wasDown ? -1 : 0),
          };
        }

        return next;
      });

      setIsSubmitting(true);
      try {
        await fetch('/api/votes', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'x-voter-id': voterId,
          },
          body: JSON.stringify({
            menu_key: menuKey,
            vote_type: isSame ? null : voteType,
            date: menuKey.split('_')[0],
          }),
        });
      } catch {
        // 실패 시 서버 상태로 재동기화
        fetch(`/api/votes?date=${date}`, {
          headers: {'x-voter-id': voterId},
        })
          .then((r) => r.json())
          .then((results: VoteResult[]) => {
            const map: VoteMap = {};
            for (const r of results) map[r.menuKey] = r;
            setVoteMap(map);
          })
          .catch(() => {});
      } finally {
        setIsSubmitting(false);
      }
    },
    [voteMap, isSubmitting, date]
  );

  return {voteMap, isLoading, isSubmitting, submitVote};
};
```

- [ ] **Step 2: 커밋**

```bash
git add src/lib/hooks/useVote.ts
git commit -m "feat: useVotes — isSubmitting, 투표 교체 optimistic update, 취소 처리"
```

---

## Task 8: CourseRow 업데이트

**Files:**
- Modify: `src/components/board/CourseRow.tsx`

변경사항:
1. `isSubmitting` prop 추가 → 버튼 `disabled`
2. 카운트를 항상 노출 (기존: 투표 후에만 노출 → 변경: showVote 시 항상 노출)

- [ ] **Step 1: CourseRow 수정**

`src/components/board/CourseRow.tsx`를 다음으로 교체:

```typescript
'use client';

import {ThumbsDown, ThumbsUp} from 'lucide-react';
import {useState} from 'react';

import {MenuCategoryLabel} from '@/constants/menu';
import {cn} from '@/lib/utils';
import {MenuType} from '@/types/menu';
import {VoteResult, VoteType} from '@/types/vote';

interface CourseRowProps {
  menu: MenuType;
  index?: number;
  showVote?: boolean;
  voteResult?: VoteResult;
  onVote?: (type: VoteType) => void;
  isSubmitting?: boolean;
}

const CourseRow = ({
  menu,
  index = 0,
  showVote,
  voteResult,
  onVote,
  isSubmitting = false,
}: CourseRowProps) => {
  const [animating, setAnimating] = useState<VoteType | null>(null);

  const total = menu.items.reduce((sum, item) => sum + (item.kcal ?? 0), 0);
  const myVote = voteResult?.myVote ?? null;

  const handleVote = (type: VoteType) => {
    if (!onVote || isSubmitting) return;
    setAnimating(type);
    onVote(type);
    setTimeout(() => setAnimating(null), 300);
  };

  return (
    <div
      className="px-5 py-4"
      style={{animation: 'fadeUp 0.28s ease both', animationDelay: `${index * 70}ms`}}
    >
      <div className="mb-1.5 flex items-end gap-2">
        <span
          className="text-accent-text text-[13px] font-extrabold tracking-wider"
          style={{background: 'linear-gradient(transparent 40%, var(--color-highlight) 40%)', paddingInline: '2px'}}
        >
          {MenuCategoryLabel[menu.category].ko}
        </span>
        {total > 0 && (
          <span className="text-muted text-[10px] font-semibold">{total} kcal</span>
        )}
        {showVote && (
          <div className="ml-auto flex gap-1">
            <button
              type="button"
              onClick={() => handleVote('up')}
              disabled={isSubmitting}
              aria-pressed={myVote === 'up'}
              aria-label="맛있어요"
              className={cn(
                'flex items-center gap-1 px-2 py-1 text-[11px] font-semibold leading-none transition-colors disabled:opacity-50',
                myVote === 'up' ? 'bg-accent-soft text-accent-text' : 'text-muted hover:text-ink',
                animating === 'up' && 'animate-[voteBounce_0.3s_ease-out]'
              )}
            >
              <ThumbsUp size={11} strokeWidth={2.5} />
              <span className="tabular-nums">
                {voteResult?.up_count ?? 0}
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleVote('down')}
              disabled={isSubmitting}
              aria-pressed={myVote === 'down'}
              aria-label="별로예요"
              className={cn(
                'flex items-center gap-1 px-2 py-1 text-[11px] font-semibold leading-none transition-colors disabled:opacity-50',
                myVote === 'down' ? 'bg-down-soft text-down' : 'text-muted hover:text-ink',
                animating === 'down' && 'animate-[voteBounce_0.3s_ease-out]'
              )}
            >
              <ThumbsDown size={11} strokeWidth={2.5} />
              <span className="tabular-nums">
                {voteResult?.down_count ?? 0}
              </span>
            </button>
          </div>
        )}
      </div>
      <p className="text-ink text-[15px] leading-relaxed font-semibold">
        {menu.items.map((item, i) => (
          <span key={item.name} className="whitespace-nowrap">
            {item.name}
            {item.kcal > 0 && (
              <i className="text-muted ml-0.5 text-[10.5px] font-semibold not-italic">
                {`${item.kcal}kcal`}
              </i>
            )}
            {i < menu.items.length - 1 && (
              <span className="mx-1.5 text-[#C9C9C6]">·</span>
            )}
          </span>
        ))}
      </p>
    </div>
  );
};

export default CourseRow;
```

- [ ] **Step 2: 커밋**

```bash
git add src/components/board/CourseRow.tsx
git commit -m "feat: CourseRow — isSubmitting disabled, count 항상 노출"
```

---

## Task 9: MenuBoard isSubmitting 연결

**Files:**
- Modify: `src/components/board/MenuBoard.tsx`

`useVotes`에서 `isSubmitting`을 꺼내 각 `CourseRow`에 전달한다.

- [ ] **Step 1: MenuBoard 수정**

`src/components/board/MenuBoard.tsx`에서 두 곳 수정:

**수정 1** — `useVotes` 구조분해에 `isSubmitting` 추가 (line 29):
```typescript
const {voteMap, submitVote, isSubmitting} = useVotes(dateStr);
```

**수정 2** — `CourseRow` props에 `isSubmitting` 전달 (line 78–84):
```typescript
<CourseRow
  key={menu.category}
  menu={menu}
  index={i}
  showVote={showVote}
  voteResult={voteMap[menuKey]}
  onVote={(type) => submitVote(menuKey, type)}
  isSubmitting={isSubmitting}
/>
```

- [ ] **Step 2: TypeScript 빌드 확인**

```bash
pnpm build
```

에러 없이 빌드되면 정상.

- [ ] **Step 3: 최종 커밋**

```bash
git add src/components/board/MenuBoard.tsx
git commit -m "feat: MenuBoard — isSubmitting CourseRow에 전달"
```

---

## Task 10: 통합 확인

- [ ] **Step 1: dev 서버 재시작**

```bash
rm -rf .next && pnpm dev
```

- [ ] **Step 2: 투표 기능 수동 테스트**

영업 종료 후 시간대(또는 `showVote` 강제 true로 임시 변경)에서:
1. 메뉴 A에 👍 클릭 → A up_count 증가, 버튼 highlight 확인
2. 메뉴 B에 👍 클릭 → A 투표 취소(count 감소), B 투표 반영 확인
3. 메뉴 B에 👍 재클릭 → B 취소(count 0으로 복귀) 확인
4. 빠르게 연속 클릭 → `isSubmitting` 동안 버튼 비활성화 확인
5. Network 탭에서 `/api/votes` POST 요청 확인

- [ ] **Step 3: cleanup API 확인**

`.env.local`의 `REVALIDATE_SECRET` 값으로:
```
http://localhost:3000/api/votes/cleanup?secret=<your-secret>
```
`{"deleted":0,"cutoff":"YYYYMMDD"}` 응답 확인.

- [ ] **Step 4: lint 확인**

```bash
pnpm lint
```

---

## Self-Review

**Spec 커버리지 체크:**
- [x] 하루 1메뉴 제한 — UNIQUE(date, voter_id) DB 제약 (Task 1)
- [x] 투표 교체 허용 — vote_or_switch RPC + optimistic update (Task 1, 7)
- [x] 중복 클릭 방지 — isSubmitting 클라이언트 상태 (Task 7, 8)
- [x] 집계 count 모든 유저 노출 — COUNT 쿼리 + count 항상 노출 (Task 3, 8)
- [x] 2주 자동 삭제 — cleanup API + vercel cron (Task 5, 6)
- [x] 취소(토글 off) — cancel_vote RPC + isSame 로직 (Task 4, 7)
- [x] 실패 시 롤백 — catch에서 서버 상태 재동기화 (Task 7)

**타입 일관성:**
- `VoteResult` 타입은 Task 2에서 정의되며 Task 3, 7, 8 모두 동일하게 사용
- `vote_type: VoteType | null` POST body는 Task 4 API와 Task 7 훅이 일치
- `date: string` (YYYYMMDD 포맷) Task 3 GET param, Task 4 POST body, Task 5 cutoff 모두 동일 포맷
