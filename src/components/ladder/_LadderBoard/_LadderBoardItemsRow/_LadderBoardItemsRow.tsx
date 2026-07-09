'use client';

import {
  CELL_BLUR,
  CELL_GLASS,
  TRACE_COLORS,
} from '@/components/ladder/_LadderBoard/_LadderBoard.constants';

import { itemInputClass } from './_LadderBoardItemsRow.styles';
import type { ItemsRowProps } from './_LadderBoardItemsRow.types';

const _LadderBoardItemsRow = ({
  items,
  disabled,
  results,
  showTraces,
  animateTraces,
  borderReadySet,
  onEdit,
}: ItemsRowProps) => {
  const isResult = showTraces && !animateTraces;

  const itemColorMap: Record<number, string> = {};
  if (isResult) {
    results.forEach((itemIdx, pIdx) => {
      if (borderReadySet.has(pIdx))
        itemColorMap[itemIdx] = TRACE_COLORS[pIdx % TRACE_COLORS.length];
    });
  }

  return (
    <div className="flex gap-1.5 px-3 pt-0 pb-3">
      {items.map((item, i) => {
        const color = itemColorMap[i];
        return (
          <div
            key={i}
            className="flex min-w-0 flex-1 flex-col items-center"
            style={{
              background: CELL_GLASS,
              backdropFilter: CELL_BLUR,
              boxShadow: color
                ? `inset 0 0 0 2px ${color}`
                : 'inset 0 0 0 1px rgba(255,255,255,0.7)',
            }}
          >
            <input
              value={item}
              onChange={(e) => onEdit(i, e.target.value)}
              readOnly={disabled}
              className={itemInputClass(disabled)}
              aria-label={`항목 ${i + 1}`}
              maxLength={8}
              placeholder={`항목 ${i + 1}`}
            />
          </div>
        );
      })}
    </div>
  );
};

export default _LadderBoardItemsRow;
