'use client';

import { useCallback, useEffect, useState } from 'react';

import { getOrCreateVoterId } from '@/utils/voterId';

const LS_PREFIX = 'renewal_feedback_';

type FeedbackState = 'idle' | 'submitting' | 'submitted' | 'error';

export const useRenewalFeedback = (version: string) => {
  const [visible, setVisible] = useState(false); // FAB 표시 여부
  const [isOpen, setIsOpen] = useState(false); // 팝업 펼침 여부
  const [score, setScore] = useState<number | null>(null);
  const [reason, setReason] = useState('');
  const [state, setState] = useState<FeedbackState>('idle');

  useEffect(() => {
    const stored = localStorage.getItem(`${LS_PREFIX}${version}`);
    if (stored !== 'submitted') setVisible(true);
  }, [version]);

  useEffect(() => {
    if (state !== 'submitted') return;
    const timer = setTimeout(() => {
      setIsOpen(false);
      setVisible(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [state]);

  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  const close = useCallback(() => setIsOpen(false), []);

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
    isOpen,
    toggle,
    close,
    score,
    setScore,
    reason,
    setReason,
    state,
    submit,
  };
};
