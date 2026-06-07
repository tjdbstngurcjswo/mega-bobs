import {render, screen} from '@testing-library/react';
import {describe, expect, test} from 'vitest';

import NewsCard from '@/components/news/NewsCard';
import type {CompanyNews} from '@/types/news';

const news: CompanyNews = {
  url: 'https://news.google.com/rss/articles/AAA',
  title: '메가존클라우드, 글로벌 AI 인프라 파트너십 체결',
  summary: null,
  source: 'ZDNet Korea',
  company: 'megazonecloud',
  publishedAt: '2026-06-04T00:00:00.000Z',
};

describe('NewsCard', () => {
  test('출처 칩 · 제목 · 날짜를 표시한다', () => {
    render(<NewsCard news={news} />);
    expect(screen.getByText('ZDNet Korea')).toBeInTheDocument();
    expect(screen.getByText(news.title)).toBeInTheDocument();
    expect(screen.getByText('2026.6.4')).toBeInTheDocument();
  });

  test('원문을 새 탭으로 여는 링크를 제공한다', () => {
    render(<NewsCard news={news} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', news.url);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('summary 가 없으면 요약 문단을 렌더링하지 않는다', () => {
    const {container} = render(<NewsCard news={news} />);
    expect(container.querySelector('p')).toBeNull();
  });
});
