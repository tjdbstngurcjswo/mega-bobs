'use client';

import { trackEvent } from '@/utils/ga';
import { useCallback, useEffect, useRef, useState } from 'react';

import { PickResult, PickType } from '@/models/vote';
import { getOrCreateVoterId } from '@/utils/voterId';

const DEFAULT_COUNTS: PickResult['counts'] = {
  COURSE_1: 0,
  COURSE_2: 0,
  TAKE_OUT: 0,
  pass: 0,
};
const EMPTY_PICK_STATE: PickResult = {
  date: '',
  counts: DEFAULT_COUNTS,
  myPick: null,
};

export const usePick = (date: string, { enabled = true } = {}) => {
  const [pickState, setPickState] = useState<PickResult>(EMPTY_PICK_STATE);
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const requestIdRef = useRef(0);
  const activeDateRef = useRef(date);
  activeDateRef.current = date;

  const activePick =
    enabled && pickState.date === date ? pickState : EMPTY_PICK_STATE;
  const { myPick, counts } = activePick;
  const isLoading =
    enabled && Boolean(date) && (pickState.date !== date || isFetching);

  useEffect(() => {
    const requestId = ++requestIdRef.current;
    if (!date || !enabled) {
      setIsFetching(false);
      return;
    }

    const controller = new AbortController();

    const fetchPick = async () => {
      const voterId = getOrCreateVoterId();
      if (!voterId) {
        setPickState({ ...EMPTY_PICK_STATE, date });
        setIsFetching(false);
        return;
      }

      setIsFetching(true);
      try {
        const res = await fetch(`/api/picks?date=${date}`, {
          headers: { 'x-voter-id': voterId },
          signal: controller.signal,
        });
        if (!res.ok) throw new Error('pick fetch failed');
        const data: PickResult = await res.json();
        if (requestId !== requestIdRef.current) return;

        setPickState({ date, myPick: data.myPick, counts: data.counts });
      } catch {
        if (requestId === requestIdRef.current && !controller.signal.aborted)
          setPickState({ ...EMPTY_PICK_STATE, date });
      } finally {
        if (requestId === requestIdRef.current) setIsFetching(false);
      }
    };

    fetchPick();
    return () => controller.abort();
  }, [date, enabled]);

  const submitPick = useCallback(
    async (pick_type: PickType) => {
      const voterId = getOrCreateVoterId();
      if (!voterId || isSubmitting) return;
      const isSame = myPick === pick_type;
      const prev = myPick;
      const prevCounts = { ...counts };

      // optimistic update
      setPickState((current) => {
        const currentPick = current.date === date ? current : EMPTY_PICK_STATE;
        const next = { ...currentPick.counts };
        if (prev) next[prev] = Math.max(0, next[prev] - 1);
        if (!isSame) next[pick_type] += 1;
        return {
          date,
          counts: next,
          myPick: isSame ? null : pick_type,
        };
      });

      setIsSubmitting(true);
      const requestDate = date;
      const requestId = requestIdRef.current;
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
        trackEvent('event', 'menu_pick', {
          pick_type: isSame ? null : pick_type,
          action: isSame ? 'cancel' : prev !== null ? 'change' : 'select',
          date,
        });
      } catch {
        if (
          activeDateRef.current === requestDate &&
          requestIdRef.current === requestId
        )
          setPickState({ date: requestDate, counts: prevCounts, myPick: prev });
      } finally {
        setIsSubmitting(false);
      }
    },
    [date, myPick, counts, isSubmitting]
  );

  return { myPick, counts, isLoading, isSubmitting, submitPick };
};
