import { sendGAEvent } from '@next/third-parties/google';
import { useCallback, useEffect, useRef, useState } from 'react';

import { VoteResult, VoteType } from '@/models/vote';
import { getOrCreateVoterId } from '@/utils/voterId';

type VoteMap = Record<string, VoteResult>;
type VoteState = { date: string; map: VoteMap };
const EMPTY_VOTE_MAP: VoteMap = {};

export const useVotes = (date: string, { enabled = true } = {}) => {
  const [voteState, setVoteState] = useState<VoteState>({ date: '', map: {} });
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const requestIdRef = useRef(0);
  const activeDateRef = useRef(date);
  activeDateRef.current = date;

  const voteMap =
    enabled && voteState.date === date ? voteState.map : EMPTY_VOTE_MAP;
  const isLoading =
    enabled && Boolean(date) && (voteState.date !== date || isFetching);

  useEffect(() => {
    const requestId = ++requestIdRef.current;
    if (!date || !enabled) {
      setIsFetching(false);
      return;
    }

    const voterId = getOrCreateVoterId();
    if (!voterId) {
      setIsFetching(false);
      return;
    }

    const controller = new AbortController();

    setIsFetching(true);
    fetch(`/api/votes?date=${date}`, {
      headers: { 'x-voter-id': voterId },
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error('vote fetch failed');
        return res.json();
      })
      .then((results: VoteResult[]) => {
        if (requestId !== requestIdRef.current) return;

        const map: VoteMap = {};
        for (const r of results) {
          map[r.menuKey] = r;
        }
        setVoteState({ date, map });
      })
      .catch(() => {})
      .finally(() => {
        if (requestId === requestIdRef.current) setIsFetching(false);
      });

    return () => controller.abort();
  }, [date, enabled]);

  const submitVote = useCallback(
    async (menuKey: string, voteType: VoteType) => {
      const voterId = getOrCreateVoterId();
      if (!voterId || isSubmitting) return;

      const current = voteMap[menuKey] ?? {
        menuKey,
        up_count: 0,
        down_count: 0,
        myVote: null,
      };
      const isSame = current.myVote === voteType;

      // 같은 날 다른 메뉴에 이미 투표한 경우 찾기
      const prevVotedKey =
        Object.keys(voteMap).find(
          (k) => k !== menuKey && voteMap[k]?.myVote !== null
        ) ?? null;

      // Optimistic update
      setVoteState((prev) => {
        const currentMap = prev.date === date ? prev.map : {};
        const next = { ...currentMap };

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

        const c = currentMap[menuKey] ?? {
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
            down_count: voteType === 'down' ? c.down_count - 1 : c.down_count,
          };
        } else {
          // 신규 or 같은 메뉴 vote_type 변경
          const wasUp = c.myVote === 'up';
          const wasDown = c.myVote === 'down';
          next[menuKey] = {
            ...c,
            myVote: voteType,
            up_count: c.up_count + (voteType === 'up' ? 1 : wasUp ? -1 : 0),
            down_count:
              c.down_count + (voteType === 'down' ? 1 : wasDown ? -1 : 0),
          };
        }

        return { date, map: next };
      });

      setIsSubmitting(true);
      try {
        const res = await fetch('/api/votes', {
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
        if (!res.ok) throw new Error('vote failed');
        sendGAEvent('event', 'menu_vote', {
          vote_type: isSame ? 'cancel' : voteType,
          course: menuKey.split('_').slice(1).join('_'),
          date: menuKey.split('_')[0],
        });
      } catch {
        // 실패 시 서버 상태로 재동기화
        const requestDate = date;
        const requestId = requestIdRef.current;
        fetch(`/api/votes?date=${date}`, {
          headers: { 'x-voter-id': voterId },
        })
          .then((r) => {
            if (!r.ok) throw new Error('vote sync failed');
            return r.json();
          })
          .then((results: VoteResult[]) => {
            if (
              activeDateRef.current !== requestDate ||
              requestIdRef.current !== requestId
            )
              return;

            const map: VoteMap = {};
            for (const r of results) map[r.menuKey] = r;
            setVoteState({ date: requestDate, map });
          })
          .catch(() => {});
      } finally {
        setIsSubmitting(false);
      }
    },
    [voteMap, isSubmitting, date]
  );

  return { voteMap, isLoading, isSubmitting, submitVote };
};
