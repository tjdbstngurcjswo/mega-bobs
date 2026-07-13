export interface ItemsRowProps {
  items: string[];
  disabled: boolean;
  results: number[];
  showTraces: boolean;
  animateTraces: boolean;
  borderReadySet: Set<number>;
  onEdit: (i: number, v: string) => void;
}
