'use client';

import { trackEvent } from '@/utils/ga';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { getOrCreateVoterId } from '@/utils/voterId';

const LS_DISMISSED = (version: string) =>
  `renewal_feedback_dismissed_${version}`;

type FeedbackState = 'idle' | 'submitting' | 'submitted' | 'error';

export const useRenewalFeedback = (version: string) => {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [reason, setReason] = useState('');
  const [state, setState] = useState<FeedbackState>('idle');

  useEffect(() => {
    const dismissed = localStorage.getItem(LS_DISMISSED(version));
    if (dismissed !== 'true') setVisible(true);
  }, [version]);

  useEffect(() => {
    if (state !== 'submitted') return;
    const timer = setTimeout(() => {
      setIsOpen(false);
      setScore(null);
      setReason('');
      setState('idle');
    }, 2000);
    return () => clearTimeout(timer);
  }, [state]);

  const toggle = useCallback(() => {
    if (!isOpen) trackEvent('event', 'feedback_open', {});
    setIsOpen((v) => !v);
  }, [isOpen]);

  const close = useCallback(() => setIsOpen(false), []);

  const dismiss = useCallback(() => {
    trackEvent('event', 'feedback_dismiss', {});
    localStorage.setItem(LS_DISMISSED(version), 'true');
    setVisible(false);
    setIsOpen(false);
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
          page: pathname,
        }),
      });

      if (!res.ok) throw new Error('submit failed');

      setState('submitted');
      trackEvent('event', 'feedback_submit', {
        score,
        has_reason: !!reason.trim(),
        page: pathname,
      });
    } catch {
      setState('error');
    }
  }, [version, score, reason, pathname]);

  return {
    visible,
    isOpen,
    toggle,
    close,
    dismiss,
    score,
    setScore,
    reason,
    setReason,
    state,
    submit,
  };
};
