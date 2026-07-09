export type LadderPhase = 'input' | 'animating' | 'result';

export interface RevealState {
  revealed: Set<number>;
  animating: Set<number>;
}
