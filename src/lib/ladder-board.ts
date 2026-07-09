import type { LadderData } from '@/utils/ladder';

export const SVG_W = 300;
export const SVG_H = 140;
export const PAD_TOP = 0;
export const PAD_BOT = 8;
const STROKE_W = 1.2;
const CORNER_R = 4;

export interface TraceSeg {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  len: number;
  pathFrac: number;
  segFrac: number;
}

export interface SegOffset {
  xOff: number;
  yOff: number;
  sw: number;
}

export const getXs = (n: number): number[] =>
  Array.from({ length: n }, (_, i) => (SVG_W * (i + 0.5)) / n);

export const getYs = (rungRows: number): number[] => {
  const range = SVG_H - PAD_TOP - PAD_BOT;
  return Array.from(
    { length: rungRows },
    (_, r) => PAD_TOP + ((r + 1) * range) / (rungRows + 1)
  );
};

export const buildTraceSegs = (
  data: LadderData,
  xs: number[],
  ys: number[]
): TraceSeg[][] => {
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

export const computeOffsets = (allSegs: TraceSeg[][]): SegOffset[][] => {
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

export const buildSmoothPaths = (
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

      const bx = s.x2 - ux * r;
      const by = s.y2 - uy * r;
      const ax = nx.x1 + nux * r;
      const ay = nx.y1 + nuy * r;

      const cx = s.isVert ? s.x2 : nx.x1;
      const cy = s.isVert ? nx.y1 : s.y2;

      d += ` L${bx.toFixed(1)},${by.toFixed(1)}`;
      d += ` Q${cx.toFixed(1)},${cy.toFixed(1)} ${ax.toFixed(1)},${ay.toFixed(1)}`;
    }

    return { d, sw, totalLen };
  });
