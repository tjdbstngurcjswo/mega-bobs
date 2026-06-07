'use client';

import {useCallback, useEffect, useState} from 'react';

import {getVoterId} from '@/lib/voterId';
import {PickResult, PickType} from '@/types/vote';

const DEFAULT_COUNTS: PickResult['counts'] = {A: 0, B: 0, takeout: 0, pass: 0};

export const usePick = (date: string, {enabled = true} = {}) => {
  const [myPick, setMyPick] = useState<PickType | null>(null);
  const [counts, setCounts] = useState<PickResult['counts']>(DEFAULT_COUNTS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!date || !enabled) {
      setIsLoading(false);
      return;
    }
    let cancelled = false;

    const fetchPick = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/picks?date=${date}`, {
          headers: {'x-voter-id': getVoterId()},
        });
        if (!res.ok || cancelled) return;
        const data: PickResult = await res.json();
        setMyPick(data.myPick);
        setCounts(data.counts);
      } catch {
        // graceful fallback — keep defaults
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchPick();
    return () => {
      cancelled = true;
    };
  }, [date, enabled]);

  const submitPick = useCallback(
    async (pick_type: PickType) => {
      if (isSubmitting) return;
      const isSame = myPick === pick_type;
      const prev = myPick;
      const prevCounts = {...counts};

      // optimistic update
      setCounts((c) => {
        const next = {...c};
        if (prev) next[prev] = Math.max(0, next[prev] - 1);
        if (!isSame) next[pick_type] += 1;
        return next;
      });
      setMyPick(isSame ? null : pick_type);

      setIsSubmitting(true);
      try {
        const res = await fetch('/api/picks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-voter-id': getVoterId(),
          },
          body: JSON.stringify({date, pick_type: isSame ? null : pick_type}),
        });
        if (!res.ok) throw new Error('submit failed');
      } catch {
        setCounts(prevCounts);
        setMyPick(prev);
      } finally {
        setIsSubmitting(false);
      }
    },
    [date, myPick, counts, isSubmitting]
  );

  return {myPick, counts, isLoading, isSubmitting, submitPick};
};
