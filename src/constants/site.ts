type NavItem = { label: string; href: string };

export const NAV_ITEMS: NavItem[] = [
  { label: '식단표', href: '/' },
  { label: '공지사항', href: '/notice' },
];

export const FOOTER_LINKS = [{ label: '공지사항', href: '/notice' }] as const;
