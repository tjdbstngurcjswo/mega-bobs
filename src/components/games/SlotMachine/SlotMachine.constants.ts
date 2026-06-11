type SpinPhase = { interval: number; duration: number };

export const MAX_NAMES = 30;
export const MIN_NAMES = 2;

export const SPIN_PHASES: SpinPhase[] = [
  { interval: 30, duration: 800 },
  { interval: 80, duration: 200 },
  { interval: 160, duration: 320 },
  { interval: 300, duration: 300 },
];
