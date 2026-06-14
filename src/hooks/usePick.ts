'use client';

import { sendGAEvent } from '@next/third-parties/google';
import { useCallback, useEffect, useState } from 'react';

import { PickResult, PickType } from '@/models/vote';
import { getOrCreateVoterId } from '@/utils/voterId';

const DEFAULT_COUNTS: PickResult['counts'] = {
  COURSE_1: 0,
  COURSE_2: 0,
  TAKE_OUT: 0,
  pass: 0,
};

export const usePick = (date: string, { enabled = true } = {}) => {
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
      const voterId = getOrCreateVoterId();
      if (!voterId) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const res = await fetch(`/api/picks?date=${date}`, {
          headers: { 'x-voter-id': voterId },
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
      const voterId = getOrCreateVoterId();
      if (!voterId || isSubmitting) return;
      const isSame = myPick === pick_type;
      const prev = myPick;
      const prevCounts = { ...counts };

      // optimistic update
      setCounts((c) => {
        const next = { ...c };
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
            'x-voter-id': voterId,
          },
          body: JSON.stringify({ date, pick_type: isSame ? null : pick_type }),
        });
        if (!res.ok) throw new Error('submit failed');
        sendGAEvent('event', 'menu_pick', {
          pick_type: isSame ? null : pick_type,
          action: isSame ? 'cancel' : prev !== null ? 'change' : 'select',
          date,
        });
      } catch {
        setCounts(prevCounts);
        setMyPick(prev);
      } finally {
        setIsSubmitting(false);
      }
    },
    [date, myPick, counts, isSubmitting]
  );

  return { myPick, counts, isLoading, isSubmitting, submitPick };
};
