'use client';

import { motion } from 'motion/react';
import { useMemo } from 'react';

import type { LadderData } from '@/utils/ladder';

import {
  ladderCardClass,
  ladderItemClass,
  ladderItemsRowClass,
  ladderNameClass,
  ladderNamesRowClass,
} from '../LadderGame.styles';

const SVG_W = 300;
const SVG_H = 280;
const PAD_X = 26;
const PAD_Y = 10;
const RAIL_COLOR = 'var(--color-board-2)';

const getXs = (n: number): number[] => {
  const range = SVG_W - 2 * PAD_X;
  return Array.from({ length: n }, (_, i) =>
    n === 1 ? SVG_W / 2 : PAD_X + (i * range) / (n - 1)
  );
};

const getYs = (rungRows: number): number[] => {
  const range = SVG_H - PAD_Y * 2;
  return Array.from({ length: rungRows }, (_, r) =>
    PAD_Y + ((r + 1) * range) / (rungRows + 1)
  );
};

const buildPaths = (data: LadderData, xs: number[], ys: number[]): string[] =>
  Array.from({ length: data.n }, (_, p) => {
    let col = p;
    const pts: [number, number][] = [[xs[col], PAD_Y]];
    for (let row = 0; row < data.rungRows; row++) {
      const rKey = `${row}:${col}`;
      const lKey = col > 0 ? `${row}:${col - 1}` : '';
      if (data.rungSet.has(rKey)) {
        pts.push([xs[col], ys[row]], [xs[col + 1], ys[row]]);
        col += 1;
      } else if (lKey && data.rungSet.has(lKey)) {
        pts.push([xs[col], ys[row]], [xs[col - 1], ys[row]]);
        col -= 1;
      }
    }
    pts.push([xs[col], SVG_H - PAD_Y]);
    return pts
      .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`)
      .join(' ');
  });

type Ease = [number, number, number, number];
const EASE_IN_OUT: Ease = [0.4, 0, 0.2, 1];

interface SvgBodyProps {
  xs: number[];
  ys: number[];
  paths: string[];
  rungs: { row: number; col: number }[];
  results: number[];
  showTraces: boolean;
  animateTraces: boolean;
}

const SvgBody = ({
  xs,
  ys,
  paths,
  rungs,
  results,
  showTraces,
  animateTraces,
}: SvgBodyProps) => {
  const botY = SVG_H - PAD_Y;
  const traceTrans = animateTraces
    ? { duration: 1.5, ease: EASE_IN_OUT }
    : { duration: 0 };

  return (
    <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} width="100%" aria-hidden="true" className="block">
      {xs.map((x, i) => (
        <line key={`v-${i}`} x1={x} y1={PAD_Y} x2={x} y2={botY} stroke={RAIL_COLOR} strokeWidth={1.5} />
      ))}
      {rungs.map(({ row, col }) => (
        <line key={`h-${row}-${col}`} x1={xs[col]} y1={ys[row]} x2={xs[col + 1]} y2={ys[row]} stroke={RAIL_COLOR} strokeWidth={1.5} />
      ))}
      {showTraces &&
        paths.map((d, i) => (
          <motion.path
            key={`trace-${i}-${animateTraces ? 'a' : 's'}`}
            d={d}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: animateTraces ? 0 : 1 }}
            animate={{ pathLength: 1 }}
            transition={traceTrans}
          />
        ))}
      {showTraces &&
        !animateTraces &&
        results.map((itemIdx, pi) => (
          <motion.circle
            key={`dot-${pi}`}
            cx={xs[itemIdx]}
            cy={botY}
            r={5}
            fill="var(--color-accent)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: pi * 0.06, type: 'spring', stiffness: 400 }}
          />
        ))}
    </svg>
  );
};

interface LadderSvgProps {
  participants: string[];
  items: string[];
  data: LadderData;
  showTraces: boolean;
  animateTraces: boolean;
}

const LadderSvgView = ({ participants, items, data, showTraces, animateTraces }: LadderSvgProps) => {
  const xs = useMemo(() => getXs(data.n), [data.n]);
  const ys = useMemo(() => getYs(data.rungRows), [data.rungRows]);
  const paths = useMemo(() => buildPaths(data, xs, ys), [data, xs, ys]);
  const rungs = useMemo(
    () => Array.from(data.rungSet).map((k) => { const [r, c] = k.split(':').map(Number); return { row: r, col: c }; }),
    [data.rungSet]
  );

  return (
    <div className={ladderCardClass}>
      <div className={ladderNamesRowClass}>
        {participants.map((name) => <p key={name} className={ladderNameClass}>{name}</p>)}
      </div>
      <SvgBody xs={xs} ys={ys} paths={paths} rungs={rungs} results={data.results} showTraces={showTraces} animateTraces={animateTraces} />
      <div className={ladderItemsRowClass}>
        {items.map((item, i) => (
          <p key={item} className={ladderItemClass(showTraces && !animateTraces && data.results.includes(i))}>
            {item}
          </p>
        ))}
      </div>
    </div>
  );
};

export default LadderSvgView;
