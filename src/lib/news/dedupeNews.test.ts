import { describe, expect, it } from 'vitest';

import { dedupeNews } from '@/lib/news/dedupeNews';
import type { ParsedItem } from '@/lib/news/parseRss';

const item = (partial: Partial<ParsedItem>): ParsedItem => ({
  url: 'https://news.google.com/rss/articles/a',
  title: '메가존클라우드, 파트너 선정',
  summary: null,
  source: '연합뉴스',
  company: 'megazonecloud',
  publishedAt: '2026-11-01T00:00:00.000Z',
  ...partial,
});

describe('dedupeNews', () => {
  it('keeps one row when the same title has different urls', () => {
    const rows = dedupeNews([
      item({ url: 'https://news.google.com/rss/articles/1' }),
      item({
        url: 'https://news.google.com/rss/articles/2',
        source: '전자신문',
      }),
    ]);

    expect(rows).toHaveLength(1);
    expect(rows[0]?.url).toBe('https://news.google.com/rss/articles/1');
  });

  it('prefers the subsidiary feed over the generic megazone feed', () => {
    const rows = dedupeNews([
      item({
        url: 'https://news.google.com/rss/articles/generic',
        company: 'megazone',
      }),
      item({
        url: 'https://news.google.com/rss/articles/cloud',
        company: 'megazonecloud',
      }),
    ]);

    expect(rows).toHaveLength(1);
    expect(rows[0]?.company).toBe('megazonecloud');
  });

  it('collapses whitespace before comparing titles', () => {
    const rows = dedupeNews([
      item({ title: '메가존클라우드,  파트너 선정' }),
      item({
        url: 'https://news.google.com/rss/articles/2',
        title: '메가존클라우드, 파트너 선정',
      }),
    ]);

    expect(rows).toHaveLength(1);
    expect(rows[0]?.title).toBe('메가존클라우드, 파트너 선정');
  });

  it('sorts the remaining rows by published time descending', () => {
    const rows = dedupeNews([
      item({ title: '먼저 난 기사', publishedAt: '2026-11-01T00:00:00.000Z' }),
      item({
        url: 'https://news.google.com/rss/articles/new',
        title: '나중 기사',
        publishedAt: '2026-11-02T00:00:00.000Z',
      }),
    ]);

    expect(rows.map((row) => row.title)).toEqual(['나중 기사', '먼저 난 기사']);
  });
});
