'use client';

import { MessageSquarePlus, Sparkles, X } from 'lucide-react';

import { useRenewalFeedback } from '@/hooks/useRenewalFeedback';

import {
  closeClass,
  containerClass,
  doneClass,
  doneIconClass,
  doneTitleClass,
  fabClass,
  headerClass,
  hintClass,
  popupClass,
  reasonClass,
  scoreButtonActive,
  scoreButtonIdle,
  scoresClass,
  submitClass,
  subtitleClass,
  titleClass,
} from './RenewalFeedbackPopup.styles';
import { RenewalFeedbackPopupProps } from './RenewalFeedbackPopup.types';

const SCORES = [1, 2, 3, 4, 5] as const;

const RenewalFeedbackPopup = ({ version }: RenewalFeedbackPopupProps) => {
  const {
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
  } = useRenewalFeedback(version);

  if (!visible) return null;

  return (
    <div className={containerClass}>
      {isOpen && (
        <div className={popupClass}>
          {state === 'submitted' ? (
            <div className={doneClass}>
              <Sparkles className={doneIconClass} color="var(--color-accent)" />
              <span className={doneTitleClass}>감사합니다!</span>
            </div>
          ) : (
            <>
              <div className={headerClass}>
                <span className={titleClass}>리뉴얼 어떠세요?</span>
                <button
                  className={closeClass}
                  onClick={close}
                  aria-label="닫기"
                >
                  <X size={14} />
                </button>
              </div>

              <p className={subtitleClass}>
                새로워진 MegaBobs, 만족도를 알려주세요
              </p>

              <div className={scoresClass}>
                {SCORES.map((n) => (
                  <button
                    key={n}
                    className={
                      score === n ? scoreButtonActive : scoreButtonIdle
                    }
                    onClick={() => setScore(n)}
                    aria-label={`${n}점`}
                  >
                    {n}
                  </button>
                ))}
              </div>

              <p className={hintClass}>1 = 별로 · 5 = 훌륭해요</p>

              {score !== null && (
                <>
                  <textarea
                    className={reasonClass}
                    rows={3}
                    maxLength={500}
                    placeholder="한 마디 남겨주세요 (선택)"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                  <button
                    className={submitClass}
                    onClick={submit}
                    disabled={state === 'submitting'}
                  >
                    {state === 'submitting' ? '제출 중...' : '제출하기'}
                  </button>
                </>
              )}
            </>
          )}
        </div>
      )}

      <button className={fabClass} onClick={toggle} aria-label="피드백 남기기">
        <MessageSquarePlus size={18} color="white" />
      </button>
    </div>
  );
};

export default RenewalFeedbackPopup;
