import { SITE_NAME } from '@/constants/site';

const url = () => process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const SITE_DESC =
  '메가존 클라우드 구내식당 주간 식단표 — 코스1·코스2·테이크아웃 메뉴 조회, 실시간 운영 상태, 맛 평가 투표, 식전 코스 픽까지. 메가존 구내식당의 모든 것.';

export const getWebsiteJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  description: SITE_DESC,
  url: url(),
  inLanguage: 'ko-KR',
});

export const getOrgJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: url(),
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
  url: url(),
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
    item: `${url()}${path}`,
  })),
});
