'use client';

import {
  CELL_BLUR,
  CELL_GLASS,
  TRACE_COLORS,
} from '@/components/ladder/_LadderBoard/_LadderBoard.constants';

import {
  cellClass,
  emojiClass,
  removeButtonClass,
} from './_LadderBoardAvatarRow.styles';
import type { AvatarRowProps } from './_LadderBoardAvatarRow.types';

const _LadderBoardAvatarRow = ({
  names,
  phase,
  showTraces,
  revealedSet,
  onRemove,
  onParticipantClick,
}: AvatarRowProps) => {
  const canRemove = phase === 'input' && names.length > 2;
  const getIsClickable = (i: number) =>
    !!onParticipantClick &&
    (phase === 'input' || (phase === 'result' && !revealedSet.has(i)));

  return (
    <div className="flex gap-1.5 px-3 pt-3 pb-0">
      {names.map((emoji, i) => {
        const isRevealed = revealedSet.has(i);
        const isClickable = getIsClickable(i);
        const isOpaque = phase === 'result' && !isRevealed;
        const color = TRACE_COLORS[i % TRACE_COLORS.length];
        const hasBorder = showTraces && isRevealed;
        return (
          <div key={i} className="relative min-w-0 flex-1">
            {canRemove && (
              <button
                type="button"
                className={removeButtonClass}
                onClick={() => onRemove(i)}
                aria-label={`참여자 ${i + 1} 제거`}
              >
                ×
              </button>
            )}
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
            <div
              className={cellClass(isClickable, isOpaque)}
              style={{
                background: CELL_GLASS,
                backdropFilter: CELL_BLUR,
                boxShadow: hasBorder
                  ? `inset 0 0 0 2px ${color}`
                  : 'inset 0 0 0 1px rgba(255,255,255,0.7)',
              }}
              onClick={isClickable ? () => onParticipantClick?.(i) : undefined}
              onKeyDown={
                isClickable
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ')
                        onParticipantClick?.(i);
                    }
                  : undefined
              }
            >
              <span className={emojiClass}>{emoji}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default _LadderBoardAvatarRow;
