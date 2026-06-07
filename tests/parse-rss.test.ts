import {describe, expect, test} from 'vitest';

import {parseRss} from '@/lib/news/parseRss';

const SAMPLE = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <item>
    <title>메가존클라우드, 글로벌 AI 인프라 파트너십 체결 - ZDNet Korea</title>
    <link>https://news.google.com/rss/articles/AAA?oc=5</link>
    <guid isPermaLink="false">AAA</guid>
    <pubDate>Wed, 04 Jun 2026 00:00:00 GMT</pubDate>
    <description>&lt;a href="https://example.com"&gt;링크&lt;/a&gt;</description>
    <source url="https://zdnet.co.kr">ZDNet Korea</source>
  </item>
  <item>
    <title>메가존, 클라우드 보안 신규 서비스 출시 &amp; 확장 - 전자신문</title>
    <link>https://news.google.com/rss/articles/BBB?oc=5</link>
    <pubDate>Fri, 29 May 2026 00:00:00 GMT</pubDate>
    <source url="https://etnews.com">전자신문</source>
  </item>
</channel></rss>`;

describe('parseRss', () => {
  test('item 들을 파싱한다', () => {
    const items = parseRss(SAMPLE, 'megazonecloud');
    expect(items).toHaveLength(2);
  });

  test('제목에서 " - 매체명" 꼬리를 제거하고 source 를 분리한다', () => {
    const [first] = parseRss(SAMPLE, 'megazonecloud');
    expect(first.title).toBe('메가존클라우드, 글로벌 AI 인프라 파트너십 체결');
    expect(first.source).toBe('ZDNet Korea');
    expect(first.company).toBe('megazonecloud');
  });

  test('HTML 엔티티를 디코드한다', () => {
    const second = parseRss(SAMPLE, 'megazone')[1];
    expect(second.title).toBe('메가존, 클라우드 보안 신규 서비스 출시 & 확장');
  });

  test('pubDate 를 ISO 8601 로 변환한다', () => {
    const [first] = parseRss(SAMPLE, 'megazonecloud');
    expect(first.publishedAt).toBe('2026-06-04T00:00:00.000Z');
  });

  test('link 가 없는 item 은 건너뛴다', () => {
    const items = parseRss('<item><title>제목만</title></item>', 'megazone');
    expect(items).toHaveLength(0);
  });
});
