import type { ParsedItem } from '@/lib/news/parseRss';

export const normalizeNewsTitle = (title: string): string =>
  title.replace(/\s+/g, ' ').trim();

const companyRank = (item: ParsedItem): number => {
  if (
    item.company === 'megazonecloud' &&
    item.title.includes('메가존클라우드')
  ) {
    return 0;
  }
  if (item.company === 'megazonesoft' && item.title.includes('메가존소프트')) {
    return 0;
  }
  if (item.company === 'megazone') return 2;
  return 1;
};

/**
 * 같은 제목은 한 건만 남긴다. 자회사 피드에서 온 행을 일반 '메가존' 행보다
 * 우선하고, 순위가 같으면 먼저 들어온 행을 유지한다.
 */
export const dedupeNews = (items: ParsedItem[]): ParsedItem[] => {
  const byTitle = new Map<string, ParsedItem>();

  for (const item of items) {
    const title = normalizeNewsTitle(item.title);
    if (!title) continue;

    const next = { ...item, title };
    const prev = byTitle.get(title);
    if (!prev || companyRank(next) < companyRank(prev)) {
      byTitle.set(title, next);
    }
  }

  return [...byTitle.values()].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
};
