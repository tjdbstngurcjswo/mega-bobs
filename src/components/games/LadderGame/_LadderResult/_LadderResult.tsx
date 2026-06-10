'use client';

import { motion } from 'motion/react';

import { getAvatarIcon } from '@/constants/iconAvatars';
import type { LadderData } from '@/utils/ladder';

import {
  resultArrowClass,
  resultBadgeClass,
  resultListClass,
  resultNameClass,
  resultRowClass,
  resultValueClass,
  retryButtonClass,
} from '../LadderGame.styles';

interface LadderResultProps {
  participants: string[];
  items: string[];
  data: LadderData;
  onRetry: () => void;
}

const _LadderResult = ({
  participants,
  items,
  data,
  onRetry,
}: LadderResultProps) => {
  const pairs = participants.map((name, i) => ({
    name,
    item: items[data.results[i]],
  }));

  const winnerItem = items[0];
  const winnerIdx = pairs.findIndex((p) => p.item === winnerItem);

  return (
    <div className="flex flex-col gap-3 animate-[fadeIn_0.3s_ease_both]">
      <div className={resultListClass}>
        {pairs.map(({ name, item }, i) => {
          const isWinner = i === winnerIdx && participants.length > 1;
          return (
            <motion.div
              key={name}
              className={resultRowClass(isWinner)}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.25 }}
            >
              <span className={resultNameClass(isWinner)} aria-label={`참여자 ${i + 1}`}>
                {(() => { const Icon = getAvatarIcon(name); return <Icon size={16} strokeWidth={1.8} aria-hidden="true" />; })()}
              </span>
              <span className={resultArrowClass(isWinner)} aria-hidden="true">
                →
              </span>
              <span className={resultValueClass(isWinner)}>{item}</span>
              {isWinner && (
                <span className={resultBadgeClass} aria-label="당첨">
                  당첨
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      <button
        type="button"
        className={retryButtonClass}
        onClick={onRetry}
        aria-label="사다리 다시하기"
      >
        ↺ 다시하기
      </button>
    </div>
  );
};

export default _LadderResult;
