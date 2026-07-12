import { SITE_NAME } from '@/constants/site';
import { SITE_URL } from '@/utils/env';

export const SITE_DESC =
  '메가존·메가존클라우드 구내식당 주간 식단표를 한눈에 확인하세요. 코스1·코스2·테이크아웃 메뉴, 실시간 운영 상태, 맛 평가 투표부터 메가존클라우드 소식·공지사항까지 메가존 임직원을 위한 점심 메뉴판입니다.';

export const getWebsiteJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  description: SITE_DESC,
  url: SITE_URL,
  inLanguage: 'ko-KR',
});

export const getOrgJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
});

export const getCafeteriaJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'FoodEstablishment',
  name: '메가존 클라우드 구내식당',
  servesCuisine: '한식',
  priceRange: '₩',
  address: {
    '@type': 'PostalAddress',
    addressLocality: '과천시',
    addressRegion: '경기도',
    addressCountry: 'KR',
  },
  openingHours: ['Mo-Fr 11:00-13:15'],
  url: SITE_URL,
});

export const getBreadcrumbJsonLd = (
  items: { name: string; path: string }[]
) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map(({ name, path }, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name,
    item: `${SITE_URL}${path}`,
  })),
});

export const getArticleJsonLd = ({
  headline,
  datePublished,
  path,
}: {
  headline: string;
  datePublished: string;
  path: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline,
  datePublished,
  dateModified: datePublished,
  author: { '@type': 'Organization', name: SITE_NAME },
  publisher: { '@type': 'Organization', name: SITE_NAME },
  mainEntityOfPage: `${SITE_URL}${path}`,
  url: `${SITE_URL}${path}`,
});

export const getNewsListJsonLd = (
  items: {
    title: string;
    url: string;
    source: string | null;
    publishedAt: string;
  }[]
) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: '메가존 소식',
  url: `${SITE_URL}/news`,
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    url: item.url,
    item: {
      '@type': 'NewsArticle',
      headline: item.title,
      url: item.url,
      datePublished: item.publishedAt,
      ...(item.source && {
        publisher: { '@type': 'Organization', name: item.source },
      }),
    },
  })),
});
