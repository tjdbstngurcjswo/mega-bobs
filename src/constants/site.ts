type NavItem = { label: string; href: string };

export const SITE_NAME = 'MegaBobs';

export const NAV_ITEMS: NavItem[] = [
  { label: '식단표', href: '/' },
  { label: '소식', href: '/news' },
  { label: '공지사항', href: '/notice' },
  { label: '미니게임', href: '/games' },
];

export const FOOTER_LINKS: { label: string; href: string }[] = [
  { label: '이용약관', href: '/terms' },
  { label: '개인정보처리방침', href: '/privacy' },
  { label: '문의', href: '/contact' },
];

export const CONTACTS: { name: string; email: string }[] = [
  { name: '박서윤', email: 'dev.yelee@gmail.com' },
  { name: '홍수혁', email: 'tngur1120@mz.co.kr' },
];
