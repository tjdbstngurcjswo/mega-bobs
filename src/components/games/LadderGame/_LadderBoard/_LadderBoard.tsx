'use client';

import { motion } from 'motion/react';
import { useMemo } from 'react';

import { cn } from '@/utils/cn';
import type { LadderData } from '@/utils/ladder';

import type { LadderPhase } from '../LadderGame.types';

const SVG_W = 300;
const SVG_H = 100;
const PAD_TOP = 0;
const PAD_BOT = 8;
const RAIL_COLOR = 'var(--color-ink-2)';
const TRACE_COLOR = 'var(--color-accent-deep)';

// Each column center at (i + 0.5) / n of SVG_W — matches flex-1 chip centers
const getXs = (n: number): number[] =>
  Array.from({ length: n }, (_, i) => SVG_W * (i + 0.5) / n);

const getYs = (rungRows: number): number[] => {
  const range = SVG_H - PAD_TOP - PAD_BOT;
  return Array.from({ length: rungRows }, (_, r) =>
    PAD_TOP + ((r + 1) * range) / (rungRows + 1)
  );
};

const buildPaths = (data: LadderData, xs: number[], ys: number[]): string[] =>
  Array.from({ length: data.n }, (_, p) => {
    let col = p;
    const pts: [number, number][] = [[xs[col], PAD_TOP]];
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
    pts.push([xs[col], SVG_H - PAD_BOT]);
    return pts
      .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`)
      .join(' ');
  });

type Ease = [number, number, number, number];
const EASE_IN_OUT: Ease = [0.4, 0, 0.2, 1];

// ── Sub-components ────────────────────────────────────────────────────────────

interface AvatarRowProps {
  names: string[];
  disabled: boolean;
  onRemove: (i: number) => void;
}

const AvatarRow = ({ names, disabled, onRemove }: AvatarRowProps) => {
  const canRemove = !disabled && names.length > 2;
  return (
    <div className="flex gap-1.5 px-3 pt-1.5 pb-0">
      {names.map((emoji, i) => (
        <div key={i} className="flex-1 min-w-0 relative">
          {canRemove && (
            <button
              type="button"
              className="absolute top-0.5 right-0.5 z-10 w-4 h-4 text-muted text-[10px] flex items-center justify-center cursor-pointer hover:text-ink leading-none"
              onClick={() => onRemove(i)}
              aria-label={`참여자 ${i + 1} 제거`}
            >×</button>
          )}
          <div className="w-full bg-surface-warm flex items-center justify-center py-2">
            <span className="font-emoji text-xl leading-none select-none">{emoji}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

interface ItemsRowProps {
  items: string[];
  disabled: boolean;
  results: number[];
  showTraces: boolean;
  animateTraces: boolean;
  onEdit: (i: number, v: string) => void;
}

const ItemsRow = ({ items, disabled, results, showTraces, animateTraces, onEdit }: ItemsRowProps) => (
  <div className="flex gap-1.5 px-3 pt-0 pb-3">
    {items.map((item, i) => {
      const isHit = showTraces && !animateTraces && results.includes(i);
      return (
        <div key={i} className="flex-1 min-w-0 bg-surface-warm">
          <input
            value={item}
            onChange={(e) => onEdit(i, e.target.value)}
            readOnly={disabled}
            className={cn(
              'w-full text-center bg-transparent text-[9px] font-bold outline-none px-0.5 py-1.5',
              'border-b-2 border-transparent focus-visible:border-accent transition-colors truncate',
              isHit ? 'text-accent-text font-extrabold' : 'text-ink-2',
              disabled && 'cursor-default'
            )}
            aria-label={`항목 ${i + 1}`}
            maxLength={8}
            placeholder={`항목 ${i + 1}`}
          />
        </div>
      );
    })}
  </div>
);

interface SvgContentProps {
  xs: number[];
  ys: number[];
  paths: string[];
  rungs: { row: number; col: number }[];
  results: number[];
  showTraces: boolean;
  animateTraces: boolean;
}

const SvgContent = ({ xs, ys, paths, rungs, results, showTraces, animateTraces }: SvgContentProps) => {
  const botY = SVG_H - PAD_BOT;
  const traceTrans = animateTraces ? { duration: 1.5, ease: EASE_IN_OUT } : { duration: 0 };
  return (
    // px-3 wrapper aligns SVG content with avatar/item rows above/below
    <div className="px-3">
      <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} width="100%" aria-hidden="true" className="block">
        {xs.map((x, i) => (
          <line key={`v-${i}`} x1={x} y1={PAD_TOP} x2={x} y2={botY} stroke={RAIL_COLOR} strokeWidth={1.5} />
        ))}
        {rungs.map(({ row, col }) => (
          <line key={`h-${row}-${col}`} x1={xs[col]} y1={ys[row]} x2={xs[col + 1]} y2={ys[row]} stroke={RAIL_COLOR} strokeWidth={1.5} />
        ))}
        {showTraces && paths.map((d, i) => (
          <motion.path key={`trace-${i}-${animateTraces ? 'a' : 's'}`}
            d={d} fill="none" stroke={TRACE_COLOR}
            strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: animateTraces ? 0 : 1 }}
            animate={{ pathLength: 1 }}
            transition={traceTrans}
          />
        ))}
        {showTraces && !animateTraces && results.map((itemIdx, pi) => (
          <motion.circle key={`dot-${pi}`}
            cx={xs[itemIdx]} cy={botY} r={5} fill={TRACE_COLOR}
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: pi * 0.06, type: 'spring', stiffness: 400 }}
          />
        ))}
      </svg>
    </div>
  );
};

// ── Main component ─────────────────────────────────────────────────────────────

export interface LadderBoardProps {
  participants: string[];
  items: string[];
  data: LadderData | null;
  phase: LadderPhase;
  canAddPerson?: boolean;
  onParticipantsChange: (v: string[]) => void;
  onItemsChange: (v: string[]) => void;
  onAddPerson?: () => void;
}

const LadderBoardView = ({ participants, items, data, phase, canAddPerson, onParticipantsChange, onItemsChange, onAddPerson }: LadderBoardProps) => {
  const disabled = phase !== 'input';
  const showTraces = phase !== 'input';
  const animateTraces = phase === 'animating';

  const xs = useMemo(() => (data ? getXs(data.n) : []), [data]);
  const ys = useMemo(() => (data ? getYs(data.rungRows) : []), [data]);
  const paths = useMemo(() => (data ? buildPaths(data, xs, ys) : []), [data, xs, ys]);
  const rungs = useMemo(
    () => data ? Array.from(data.rungSet).map((k) => { const [r, c] = k.split(':').map(Number); return { row: r, col: c }; }) : [],
    [data]
  );

  const removePerson = (i: number) => {
    const nextP = participants.filter((_, idx) => idx !== i);
    onParticipantsChange(nextP);
    onItemsChange(items.slice(0, nextP.length));
  };

  const editItem = (i: number, val: string) => {
    const next = [...items]; next[i] = val; onItemsChange(next);
  };

  return (
    <div className="bg-surface shadow-[var(--shadow-card)]">
      <div className="flex justify-end px-3 pt-2">
        <button
          type="button"
          onClick={onAddPerson}
          disabled={!canAddPerson}
          className={cn(
            'text-[11px] cursor-pointer transition-opacity',
            canAddPerson ? 'text-muted hover:text-ink' : 'invisible'
          )}
          aria-label="인원 추가"
        >+ 인원 추가</button>
      </div>
      <AvatarRow names={participants} disabled={disabled} onRemove={removePerson} />
      {data
        ? <SvgContent xs={xs} ys={ys} paths={paths} rungs={rungs} results={data.results} showTraces={showTraces} animateTraces={animateTraces} />
        : <div className="aspect-[3/1] px-3" />
      }
      <ItemsRow items={items} disabled={disabled} results={data?.results ?? []} showTraces={showTraces} animateTraces={animateTraces} onEdit={editItem} />
    </div>
  );
};

export default LadderBoardView;
