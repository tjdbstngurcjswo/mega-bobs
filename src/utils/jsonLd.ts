import { SITE_URL } from '@/utils/env';

import { SITE_NAME } from '@/constants/site';

export const SITE_DESC =
  '메가존 구내식당·메가존클라우드 구내식당 주간 식단표를 한눈에. 코스1·코스2·테이크아웃 메뉴 조회, 실시간 운영 상태 확인, 맛 평가 투표까지.';

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
