'use client';

import { X } from 'lucide-react';

import { useRenewalFeedback } from '@/hooks/useRenewalFeedback';

import {
  backdropClass,
  closeClass,
  containerClass,
  doneClass,
  doneSubClass,
  doneTitleClass,
  fabClass,
  fabTextClass,
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
    <>
      {isOpen && (
        <div className={backdropClass} onClick={close} aria-hidden="true" />
      )}
      <div className={containerClass}>
        {isOpen && (
          <div className={popupClass}>
            {state === 'submitted' ? (
              <div className={doneClass}>
                <span className={doneTitleClass}>감사합니다!</span>
                <span className={doneSubClass}>소중한 의견을 남겨주셨어요</span>
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
                    <X size={13} />
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

        <button
          className={fabClass}
          onClick={toggle}
          aria-label="피드백 남기기"
        >
          <span
            className={fabTextClass}
            style={{
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              transform: 'rotate(180deg)',
            }}
          >
            Feedback
          </span>
        </button>
      </div>
    </>
  );
};

export default RenewalFeedbackPopup;
