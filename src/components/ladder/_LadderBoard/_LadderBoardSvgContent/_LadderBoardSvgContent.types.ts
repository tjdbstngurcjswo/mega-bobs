export interface SvgContentProps {
  xs: number[];
  ys: number[];
  rungs: { row: number; col: number }[];
  smoothPaths: { d: string; sw: number; totalLen: number }[];
  showTraces: boolean;
  revealedSet: Set<number>;
  animatingSet: Set<number>;
}
