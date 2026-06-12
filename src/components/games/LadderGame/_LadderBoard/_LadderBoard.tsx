/* eslint-disable max-lines */
'use client';

import { motion } from 'motion/react';
import { useMemo } from 'react';

import { cn } from '@/utils/cn';
import type { LadderData } from '@/utils/ladder';

import type { LadderPhase } from '../LadderGame.types';

const SVG_W = 300;
const SVG_H = 200;
const PAD_TOP = 0;
const PAD_BOT = 16;
const RAIL_COLOR = 'rgba(69,80,96,0.45)';
const TRACE_COLORS = [
  '#e05c52', '#4a7fc1', '#4aac73', '#c2a02e',
  '#7c5bbf', '#3fa8a0', '#d97843', '#c05480',
];
const ANIM_S = 5;
const STROKE_W = 1.2;
const CORNER_R = 4;

const getXs = (n: number): number[] =>
  Array.from({ length: n }, (_, i) => SVG_W * (i + 0.5) / n);

const getYs = (rungRows: number): number[] => {
  const range = SVG_H - PAD_TOP - PAD_BOT;
  return Array.from({ length: rungRows }, (_, r) =>
    PAD_TOP + ((r + 1) * range) / (rungRows + 1)
  );
};

// ── Segment-based traces with overlap detection ────────────────────────────────

interface TraceSeg {
  x1: number; y1: number;
  x2: number; y2: number;
  len: number;
  pathFrac: number;
  segFrac: number;
}

const buildTraceSegs = (data: LadderData, xs: number[], ys: number[]): TraceSeg[][] => {
  const botY = SVG_H - PAD_BOT;
  return Array.from({ length: data.n }, (_, p) => {
    let col = p;
    const raw: { x1: number; y1: number; x2: number; y2: number }[] = [];
    let prevY = PAD_TOP;

    for (let row = 0; row <= data.rungRows; row++) {
      const nextY = row < data.rungRows ? ys[row] : botY;
      raw.push({ x1: xs[col], y1: prevY, x2: xs[col], y2: nextY });

      if (row < data.rungRows) {
        const rKey = `${row}:${col}`;
        const lKey = col > 0 ? `${row}:${col - 1}` : '';
        if (data.rungSet.has(rKey)) {
          raw.push({ x1: xs[col], y1: nextY, x2: xs[col + 1], y2: nextY });
          col += 1;
        } else if (lKey && data.rungSet.has(lKey)) {
          raw.push({ x1: xs[col], y1: nextY, x2: xs[col - 1], y2: nextY });
          col -= 1;
        }
      }
      prevY = nextY;
    }

    const lens = raw.map((s) => Math.hypot(s.x2 - s.x1, s.y2 - s.y1));
    const total = lens.reduce((a, b) => a + b, 0) || 1;
    let acc = 0;
    return raw.map((s, i) => {
      const pathFrac = acc / total;
      const segFrac = lens[i] / total;
      acc += lens[i];
      return { ...s, len: lens[i], pathFrac, segFrac };
    });
  });
};

interface SegOffset { xOff: number; yOff: number; sw: number }

const computeOffsets = (allSegs: TraceSeg[][]): SegOffset[][] => {

  const segKey = (s: TraceSeg) => {
    const [ax, ay, bx, by] =
      s.x1 <= s.x2 ? [s.x1, s.y1, s.x2, s.y2] : [s.x2, s.y2, s.x1, s.y1];
    return `${ax.toFixed(1)},${ay.toFixed(1)},${bx.toFixed(1)},${by.toFixed(1)}`;
  };

  const groups = new Map<string, { ti: number; si: number }[]>();
  allSegs.forEach((segs, ti) =>
    segs.forEach((seg, si) => {
      const k = segKey(seg);
      const group = groups.get(k);
      if (group) {
        group.push({ ti, si });
      } else {
        groups.set(k, [{ ti, si }]);
      }
    })
  );

  const result: SegOffset[][] = allSegs.map((segs) =>
    segs.map(() => ({ xOff: 0, yOff: 0, sw: STROKE_W }))
  );

  groups.forEach((group) => {
    if (group.length <= 1) return;
    const n = group.length;
    const sw = (STROKE_W * 2) / n;
    const { ti: ti0, si: si0 } = group[0];
    const seg = allSegs[ti0][si0];
    const isVert = Math.abs(seg.x1 - seg.x2) < 0.5;
    group.forEach(({ ti, si }, order) => {
      const off = (order - (n - 1) / 2) * sw;
      result[ti][si] = { xOff: isVert ? off : 0, yOff: isVert ? 0 : off, sw };
    });
  });

  return result;
};

const buildSmoothPaths = (
  allSegs: TraceSeg[][],
  offsets: SegOffset[][]
): { d: string; sw: number; totalLen: number }[] =>
  allSegs.map((segs, ti) => {
    const off = offsets[ti];
    const sw = off.length ? Math.min(...off.map((o) => o.sw)) : STROKE_W;
    const totalLen = segs.reduce((s, seg) => s + seg.len, 0);
    if (!segs.length) return { d: '', sw, totalLen: 0 };

    const eff = segs.map((s, si) => ({
      x1: s.x1 + off[si].xOff,
      y1: s.y1 + off[si].yOff,
      x2: s.x2 + off[si].xOff,
      y2: s.y2 + off[si].yOff,
      len: s.len,
      isVert: Math.abs(s.x1 - s.x2) < 0.5,
    }));

    let d = `M${eff[0].x1.toFixed(1)},${eff[0].y1.toFixed(1)}`;

    for (let i = 0; i < eff.length; i++) {
      const s = eff[i];
      const nx = eff[i + 1];

      if (!nx) {
        d += ` L${s.x2.toFixed(1)},${s.y2.toFixed(1)}`;
        continue;
      }

      const r = Math.min(CORNER_R, s.len / 2, nx.len / 2);
      const dl = s.len || 1;
      const ux = (s.x2 - s.x1) / dl;
      const uy = (s.y2 - s.y1) / dl;
      const ndl = nx.len || 1;
      const nux = (nx.x2 - nx.x1) / ndl;
      const nuy = (nx.y2 - nx.y1) / ndl;

      // Curve start / end
      const bx = s.x2 - ux * r;
      const by = s.y2 - uy * r;
      const ax = nx.x1 + nux * r;
      const ay = nx.y1 + nuy * r;

      // Corner control: combine offsets from both segments
      const cx = s.isVert ? s.x2 : nx.x1;
      const cy = s.isVert ? nx.y1 : s.y2;

      d += ` L${bx.toFixed(1)},${by.toFixed(1)}`;
      d += ` Q${cx.toFixed(1)},${cy.toFixed(1)} ${ax.toFixed(1)},${ay.toFixed(1)}`;
    }

    return { d, sw, totalLen };
  });

// ── Sub-components ─────────────────────────────────────────────────────────────

const CELL_GLASS = 'rgba(255,255,255,0.5)';
const CELL_BLUR = 'blur(6px)';

interface AvatarRowProps {
  names: string[];
  phase: LadderPhase;
  showTraces: boolean;
  revealedSet: Set<number>;
  onRemove: (i: number) => void;
  onParticipantClick?: (i: number) => void;
}

const AvatarRow = ({
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
          <div key={i} className="flex-1 min-w-0 relative">
            {canRemove && (
              <button
                type="button"
                className="absolute top-0.5 right-0.5 z-10 w-4 h-4 text-muted text-[10px] flex items-center justify-center cursor-pointer hover:text-ink leading-none"
                onClick={() => onRemove(i)}
                aria-label={`참여자 ${i + 1} 제거`}
              >
                ×
              </button>
            )}
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
            <div
              className={cn(
                'w-full flex items-center justify-center py-2 transition-opacity',
                isClickable && 'cursor-pointer hover:opacity-75',
                isOpaque && 'opacity-40'
              )}
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
              <span className="font-emoji text-xl leading-none select-none">
                {emoji}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

interface ItemsRowProps {
  items: string[];
  disabled: boolean;
  results: number[];
  showTraces: boolean;
  animateTraces: boolean;
  borderReadySet: Set<number>;
  onEdit: (i: number, v: string) => void;
}

const ItemsRow = ({
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
            className="flex-1 min-w-0 flex flex-col items-center"
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
              className={cn(
                'w-full text-center bg-transparent text-[9px] font-bold outline-none px-0.5 py-1.5',
                'border-b-2 border-transparent focus-visible:border-accent transition-colors truncate',
                'text-ink-2',
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
};


interface SvgContentProps {
  xs: number[];
  ys: number[];
  rungs: { row: number; col: number }[];
  smoothPaths: { d: string; sw: number; totalLen: number }[];
  showTraces: boolean;
  revealedSet: Set<number>;
  animatingSet: Set<number>;
}

const SvgContent = ({
  xs,
  ys,
  rungs,
  smoothPaths,
  showTraces,
  revealedSet,
  animatingSet,
}: SvgContentProps) => {
  const botY = SVG_H - PAD_BOT;
  const maxLen = Math.max(...smoothPaths.map((p) => p.totalLen), 1);
  const speed = maxLen / ANIM_S; // SVG units per second — constant across all traces
  return (
    <div className="px-3">
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        width="100%"
        aria-hidden="true"
        className="block"
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

// ── Main component ─────────────────────────────────────────────────────────────

interface LadderBoardProps {
  participants: string[];
  items: string[];
  data: LadderData | null;
  phase: LadderPhase;
  revealedSet: Set<number>;
  animatingSet: Set<number>;
  borderReadySet: Set<number>;
  onParticipantsChange: (v: string[]) => void;
  onItemsChange: (v: string[]) => void;
  onParticipantClick?: (i: number) => void;
}

// eslint-disable-next-line max-lines-per-function
const LadderBoardView = ({
  participants,
  items,
  data,
  phase,
  revealedSet,
  animatingSet,
  borderReadySet,
  onParticipantsChange,
  onItemsChange,
  onParticipantClick,
}: LadderBoardProps) => {
  const disabled = phase !== 'input';
  const showTraces = phase !== 'input';
  const animateTraces = phase === 'animating';

  const xs = useMemo(() => getXs(participants.length), [participants.length]);
  const ys = useMemo(() => (data ? getYs(data.rungRows) : []), [data]);
  const allSegs = useMemo(
    () => (data ? buildTraceSegs(data, xs, ys) : []),
    [data, xs, ys]
  );
  const offsets = useMemo(() => computeOffsets(allSegs), [allSegs]);
  const smoothPaths = useMemo(() => buildSmoothPaths(allSegs, offsets), [allSegs, offsets]);
  const rungs = useMemo(
    () =>
      data
        ? Array.from(data.rungSet).map((k) => {
            const [r, c] = k.split(':').map(Number);
            return { row: r, col: c };
          })
        : [],
    [data]
  );

  const removePerson = (i: number) => {
    const nextP = participants.filter((_, idx) => idx !== i);
    onParticipantsChange(nextP);
    onItemsChange(items.slice(0, nextP.length));
  };

  const editItem = (i: number, val: string) => {
    const next = [...items];
    next[i] = val;
    onItemsChange(next);
  };

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.35)',
        backdropFilter: 'blur(24px)',
        boxShadow:
          '0 2px 8px rgba(0,0,0,0.08), 0 8px 28px rgba(0,0,0,0.06), inset 0 0 0 1.5px rgba(255,255,255,0.88)',
      }}
    >
      <AvatarRow
        names={participants}
        phase={phase}
        showTraces={showTraces}
        revealedSet={revealedSet}
        onRemove={removePerson}
        onParticipantClick={onParticipantClick}
      />
      <SvgContent
        xs={xs}
        ys={ys}
        rungs={rungs}
        smoothPaths={smoothPaths}
        showTraces={showTraces}
        revealedSet={revealedSet}
        animatingSet={animatingSet}
      />
      <ItemsRow
        items={items}
        disabled={disabled}
        results={data?.results ?? []}
        showTraces={showTraces}
        animateTraces={animateTraces}
        borderReadySet={borderReadySet}
        onEdit={editItem}
      />
    </div>
  );
};

export default LadderBoardView;
