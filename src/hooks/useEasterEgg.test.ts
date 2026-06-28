import { describe, expect, it } from 'vitest';

import { calcEggStep } from './useEasterEgg';

describe('calcEggStep', () => {
  it('returns 0 for clicks 0-2', () => {
    expect(calcEggStep(0)).toBe(0);
    expect(calcEggStep(1)).toBe(0);
    expect(calcEggStep(2)).toBe(0);
  });

  it('returns 1 for click count 3', () => {
    expect(calcEggStep(3)).toBe(1);
  });

  it('returns 2 for click count 4', () => {
    expect(calcEggStep(4)).toBe(2);
  });

  it('returns 2 for counts above 4', () => {
    expect(calcEggStep(5)).toBe(2);
    expect(calcEggStep(10)).toBe(2);
  });
});
