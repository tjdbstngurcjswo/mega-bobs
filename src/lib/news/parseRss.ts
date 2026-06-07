import type {NewsCompany} from '@/types/news';

export type ParsedItem = {
  url: string;
  title: string;
  summary: string | null;
  source: string | null;
  company: NewsCompany;
  publishedAt: string; // ISO 8601
};

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  '#39': "'",
  nbsp: ' ',
};

const decodeEntities = (raw: string): string =>
  raw.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, code: string) => {
    if (code[0] === '#') {
      const num =
        code[1] === 'x' || code[1] === 'X'
          ? parseInt(code.slice(2), 16)
          : parseInt(code.slice(1), 10);
      return Number.isNaN(num) ? match : String.fromCodePoint(num);
    }
    return NAMED_ENTITIES[code] ?? match;
  });

const stripCdata = (raw: string): string =>
  raw.replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '');

const clean = (raw: string | undefined): string =>
  raw ? decodeEntities(stripCdata(raw.trim())).trim() : '';

const tagContent = (block: string, tag: string): string | undefined => {
  const match = block.match(
    new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i')
  );
  return match?.[1];
};

/** Google News 제목은 "기사 제목 - 매체명" 형식 — 매체명 꼬리를 제거한다. */
const stripSourceSuffix = (title: string, source: string | null): string => {
  if (source && title.endsWith(` - ${source}`)) {
    return title.slice(0, -(source.length + 3)).trim();
  }
  return title;
};

/**
 * Google News RSS XML 파싱. 외부 의존성 없이 안정적인 RSS 구조만 처리한다.
 * (Google News RSS 는 기사 본문 스니펫을 제공하지 않으므로 summary 는 null 일 수 있다.)
 */
export const parseRss = (xml: string, company: NewsCompany): ParsedItem[] => {
  const blocks = xml.match(/<item>[\s\S]*?<\/item>/gi) ?? [];

  return blocks.flatMap((block) => {
    const url = clean(tagContent(block, 'link'));
    const rawTitle = clean(tagContent(block, 'title'));
    if (!url || !rawTitle) return [];

    const source = clean(tagContent(block, 'source')) || null;
    const pubDate = clean(tagContent(block, 'pubDate'));
    const published = pubDate ? new Date(pubDate) : null;

    return [
      {
        url,
        title: stripSourceSuffix(rawTitle, source),
        summary: null,
        source,
        company,
        publishedAt:
          published && !Number.isNaN(published.getTime())
            ? published.toISOString()
            : new Date().toISOString(),
      },
    ];
  });
};
