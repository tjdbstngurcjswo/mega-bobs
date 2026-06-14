'use client';

import { useCallback, useEffect, useState } from 'react';

import { getOrCreateVoterId } from '@/utils/voterId';

const LS_PREFIX = 'renewal_feedback_';

type FeedbackState = 'idle' | 'submitting' | 'submitted' | 'error';

export const useRenewalFeedback = (version: string) => {
  const [visible, setVisible] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [reason, setReason] = useState('');
  const [state, setState] = useState<FeedbackState>('idle');

  useEffect(() => {
    const stored = localStorage.getItem(`${LS_PREFIX}${version}`);
    if (!stored) setVisible(true);
  }, [version]);

  useEffect(() => {
    if (state !== 'submitted') return;
    const timer = setTimeout(() => setVisible(false), 2000);
    return () => clearTimeout(timer);
  }, [state]);

  const dismiss = useCallback(() => {
    localStorage.setItem(`${LS_PREFIX}${version}`, 'dismissed');
    setVisible(false);
  }, [version]);

  const submit = useCallback(async () => {
    if (!score) return;
    const voterId = getOrCreateVoterId();
    if (!voterId) return;

    setState('submitting');
    try {
      const res = await fetch('/api/renewal-feedback', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-voter-id': voterId,
        },
        body: JSON.stringify({
          version,
          score,
          reason: reason.trim() || undefined,
        }),
      });

      if (!res.ok) throw new Error('submit failed');

      localStorage.setItem(`${LS_PREFIX}${version}`, 'submitted');
      setState('submitted');
    } catch {
      setState('error');
    }
  }, [version, score, reason]);

  return {
    visible,
    score,
    setScore,
    reason,
    setReason,
    state,
    dismiss,
    submit,
  };
};
