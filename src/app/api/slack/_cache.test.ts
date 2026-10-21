import { describe, expect, it } from 'vitest';

import { isMenuCacheHit } from './_cache';

describe('isMenuCacheHit', () => {
  it('is a hit when the menu was cached before this request', () => {
    expect(isMenuCacheHit(1_000, 2_000)).toBe(true);
  });

  it('is a miss when the menu was cached during this request', () => {
    expect(isMenuCacheHit(2_000, 2_000)).toBe(false);
    expect(isMenuCacheHit(2_001, 2_000)).toBe(false);
  });
});
