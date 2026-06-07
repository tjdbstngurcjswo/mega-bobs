import {useCallback, useEffect, useState} from 'react';

import {getVoterId} from '@/hooks/voterId';
import {VoteResult, VoteType} from '@/types/vote';

type VoteMap = Record<string, VoteResult>;

export const useVotes = (date: string, {enabled = true} = {}) => {
  const [voteMap, setVoteMap] = useState<VoteMap>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!date || !enabled) return;
    const voterId = getVoterId();
    if (!voterId) return;

    setIsLoading(true);
    setVoteMap({});
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
  }, [date, enabled]);

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
      const prevVotedKey =
        Object.keys(voteMap).find(
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
            up_count: c.up_count + (voteType === 'up' ? 1 : wasUp ? -1 : 0),
            down_count:
              c.down_count + (voteType === 'down' ? 1 : wasDown ? -1 : 0),
          };
        }

        return next;
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
