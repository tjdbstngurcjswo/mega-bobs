'use client';

import { Plane, Sparkles } from 'lucide-react';
import { useState } from 'react';

import { trackEvent } from '@/utils/ga';

import {
  BOARD_EMPTY_COPY,
  INITIAL_PLANE_COUNT,
  PLANE_CONFIGS,
  SPARKLE_POSITIONS,
} from './MenuBoardEmpty.constants';
import {
  emptyBodyClass,
  emptyLabelClass,
  emptyTitleClass,
  planeClass,
  planeWrapperClass,
} from './MenuBoardEmpty.styles';
import { MenuBoardEmptyProps } from './MenuBoardEmpty.types';

const MenuBoardEmpty = ({
  variant,
  date,
  isToday,
  isPast,
}: MenuBoardEmptyProps) => {
  const copy = BOARD_EMPTY_COPY[variant];
  const [planeCount, setPlaneCount] = useState(INITIAL_PLANE_COUNT);

  const handlePlaneClick = () => {
    const next =
      planeCount >= PLANE_CONFIGS.length ? INITIAL_PLANE_COUNT : planeCount + 1;
    trackEvent('event', 'easter_egg_airplane', {
      plane_count: next,
      is_max: next >= PLANE_CONFIGS.length,
    });
    setPlaneCount(next);
  };

  const closedTitle = (() => {
    if (variant !== 'closed') return copy.title;
    const dateStr = date
      ? `${parseInt(date.slice(5, 7), 10)}월 ${parseInt(date.slice(8, 10), 10)}일은 `
      : '';
    if (isToday) return '오늘은 구내식당이 쉬는 날이에요';
    if (isPast) return `${dateStr}쉬는 날이었어요`;
    return `${dateStr}${copy.title}`;
  })();

  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden px-6 py-12 text-center">
      {variant === 'closed' && (
        <div
          aria-hidden
          className={planeWrapperClass}
          onClick={handlePlaneClick}
        >
          {PLANE_CONFIGS.slice(0, planeCount).map((cfg, i) => (
            <span
              key={i}
              className={planeClass}
              style={{
                top: cfg.top,
                opacity: cfg.opacity,
                animation: `planeFly ${cfg.duration}s linear ${cfg.delay}s infinite`,
              }}
            >
              <Plane size={cfg.size} strokeWidth={1.5} />
            </span>
          ))}
        </div>
      )}
      {variant === 'comingUp' && (
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {SPARKLE_POSITIONS.map((s, i) => (
            <span
              key={i}
              className="text-accent absolute"
              style={{
                left: s.left,
                bottom: s.bottom,
                animation: `floatUp 3.6s ease-in-out ${s.delay} infinite`,
              }}
            >
              <Sparkles size={s.size} strokeWidth={1.5} />
            </span>
          ))}
        </div>
      )}
      <div className="relative">
        <div className={emptyLabelClass}>{copy.label}</div>
        <h3 className={emptyTitleClass}>{closedTitle}</h3>
        {variant === 'closed' && isPast && 'bodyPast' in copy ? (
          <p className={emptyBodyClass}>{copy.bodyPast}</p>
        ) : (
          copy.body && <p className={emptyBodyClass}>{copy.body}</p>
        )}
      </div>
    </div>
  );
};

export default MenuBoardEmpty;
