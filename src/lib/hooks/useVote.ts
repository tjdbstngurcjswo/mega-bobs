import {useCallback, useEffect, useState} from 'react';

import {getVoterId} from '@/lib/voterId';
import {VoteResult, VoteType} from '@/types/vote';

type VoteMap = Record<string, VoteResult>;

export const useVotes = (date: string) => {
  const [voteMap, setVoteMap] = useState<VoteMap>({});
  const [isLoading, setIsLoading] = useState(false);

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
    (menuKey: string, voteType: VoteType) => {
      const voterId = getVoterId();
      if (!voterId) return;

      // Optimistic update
      setVoteMap((prev) => {
        const current = prev[menuKey] ?? {
          menuKey,
          up_count: 0,
          down_count: 0,
          myVote: null,
        };
        const wasUp = current.myVote === 'up';
        const wasDown = current.myVote === 'down';
        const isSame = current.myVote === voteType;

        return {
          ...prev,
          [menuKey]: {
            ...current,
            myVote: isSame ? null : voteType,
            up_count:
              current.up_count +
              (voteType === 'up' ? (isSame ? -1 : wasDown ? 1 : 1) : wasUp ? -1 : 0),
            down_count:
              current.down_count +
              (voteType === 'down'
                ? isSame
                  ? -1
                  : wasUp
                    ? 1
                    : 1
                : wasDown
                  ? -1
                  : 0),
          },
        };
      });

      fetch('/api/votes', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-voter-id': voterId,
        },
        body: JSON.stringify({menu_key: menuKey, vote_type: voteType}),
      }).catch(() => {});
    },
    []
  );

  return {voteMap, isLoading, submitVote};
};
