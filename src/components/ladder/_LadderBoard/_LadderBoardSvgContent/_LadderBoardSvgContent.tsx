'use client';

import { motion } from 'motion/react';

import { useGameWindow } from '@/components/@shared';
import { PAD_BOT, PAD_TOP, SVG_H, SVG_W } from '@/lib/ladder-board';

import {
  ANIM_S,
  RAIL_COLOR,
  TRACE_COLORS,
} from '@/components/ladder/_LadderBoard/_LadderBoard.constants';

import type { SvgContentProps } from './_LadderBoardSvgContent.types';

const _LadderBoardSvgContent = ({
  xs,
  ys,
  rungs,
  smoothPaths,
  showTraces,
  revealedSet,
  animatingSet,
}: SvgContentProps) => {
  const { isFullView } = useGameWindow();
  const botY = SVG_H - PAD_BOT;
  const maxLen = Math.max(...smoothPaths.map((p) => p.totalLen), 1);
  const speed = maxLen / ANIM_S;

  return (
    <div
      className="px-3 sm:h-[150px]"
      style={isFullView ? { height: 'calc(100dvh - 220px)' } : undefined}
    >
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        width="100%"
        aria-hidden="true"
        className="block"
        preserveAspectRatio="none"
        style={{ height: '100%' }}
      >
        {xs.map((x, i) => (
          <line
            key={`v-${i}`}
            x1={x}
            y1={PAD_TOP}
            x2={x}
            y2={botY}
            stroke={RAIL_COLOR}
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {rungs.map(({ row, col }) => (
          <line
            key={`h-${row}-${col}`}
            x1={xs[col]}
            y1={ys[row]}
            x2={xs[col + 1]}
            y2={ys[row]}
            stroke={RAIL_COLOR}
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {showTraces &&
          smoothPaths.map(({ d, sw, totalLen }, i) =>
            revealedSet.has(i) && d ? (
              <motion.path
                key={`trace-${i}-${animatingSet.has(i) ? 'a' : 's'}`}
                d={d}
                fill="none"
                stroke={TRACE_COLORS[i % TRACE_COLORS.length]}
                strokeWidth={sw}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={
                  animatingSet.has(i)
                    ? { duration: totalLen / speed, ease: 'linear' }
                    : { duration: 0 }
                }
              />
            ) : null
          )}
      </svg>
    </div>
  );
};

export default _LadderBoardSvgContent;
