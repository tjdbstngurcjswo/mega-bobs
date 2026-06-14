'use client';

import { useMemo } from 'react';

import {
  buildSmoothPaths,
  buildTraceSegs,
  computeOffsets,
  getXs,
  getYs,
} from '@/lib/ladder-board';

import { _LadderBoardAvatarRow } from './_LadderBoardAvatarRow';
import { _LadderBoardItemsRow } from './_LadderBoardItemsRow';
import { _LadderBoardSvgContent } from './_LadderBoardSvgContent';
import type { LadderBoardProps } from './_LadderBoard.types';

const LadderBoardView = ({
  participants,
  items,
  data,
  phase,
  reveal,
  onParticipantsChange,
  onItemsChange,
  onParticipantClick,
}: LadderBoardProps) => {
  const { revealed: revealedSet, animating: animatingSet } = reveal;
  const borderReadySet = new Set(
    [...revealedSet].filter((i) => !animatingSet.has(i))
  );
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
  const smoothPaths = useMemo(
    () => buildSmoothPaths(allSegs, offsets),
    [allSegs, offsets]
  );
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
      <_LadderBoardAvatarRow
        names={participants}
        phase={phase}
        showTraces={showTraces}
        revealedSet={revealedSet}
        onRemove={removePerson}
        onParticipantClick={onParticipantClick}
      />
      <_LadderBoardSvgContent
        xs={xs}
        ys={ys}
        rungs={rungs}
        smoothPaths={smoothPaths}
        showTraces={showTraces}
        revealedSet={revealedSet}
        animatingSet={animatingSet}
      />
      <_LadderBoardItemsRow
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
