import { describe, expect, it } from 'vitest';

import { resolveSiteUrl } from './siteUrl';

describe('resolveSiteUrl', () => {
  it('uses the vercel app when the site url is missing', () => {
    expect(resolveSiteUrl(undefined)).toBe('https://megabobs.vercel.app');
  });

  it('replaces the expired megabobs.com hosts', () => {
    expect(resolveSiteUrl('https://megabobs.com')).toBe(
      'https://megabobs.vercel.app'
    );
    expect(resolveSiteUrl('https://www.megabobs.com/notice')).toBe(
      'https://megabobs.vercel.app'
    );
  });

  it('keeps any other origin', () => {
    expect(resolveSiteUrl('https://megabobs.vercel.app/news')).toBe(
      'https://megabobs.vercel.app'
    );
    expect(resolveSiteUrl('https://menu.example.com/path')).toBe(
      'https://menu.example.com'
    );
  });

  it('falls back when the value is not a url', () => {
    expect(resolveSiteUrl('not a url')).toBe('https://megabobs.vercel.app');
  });
});
