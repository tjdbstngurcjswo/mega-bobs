type NavItem = { label: string; href: string; disabled?: boolean };

/** 미구현 라우트는 disabled — UI에 '준비 중'으로 표시, 후속 플랜에서 해제 */
export const NAV_ITEMS: NavItem[] = [
  { label: '오늘의 메뉴', href: '/' },
  { label: '내기 게임', href: '/games', disabled: true },
  { label: '주변 맛집', href: '/nearby', disabled: true },
  { label: '블로그', href: '/blog', disabled: true },
  { label: '메가존 소식', href: '/news', disabled: true },
];

type HomeEntry = {
  no: string;
  label: string;
  desc: string;
  href: string;
  disabled?: boolean;
};

/** 미구현 진입 항목 — UI에 '준비 중'으로 표시, 후속 플랜에서 활성화 */
export const HOME_ENTRIES: HomeEntry[] = [
  {
    no: '01',
    label: '내기 게임',
    desc: '사다리 · 슬롯 · 풍선으로 커피 내기',
    href: '/games',
    disabled: true,
  },
  {
    no: '02',
    label: '주변 맛집',
    desc: '지정타 직장인 검증 맛집 10곳',
    href: '/nearby',
    disabled: true,
  },
  {
    no: '03',
    label: '블로그',
    desc: '어제의 투표 결과와 점심 이야기',
    href: '/blog',
    disabled: true,
  },
  {
    no: '04',
    label: '메가존 소식',
    desc: '우리 회사 새 소식 모아보기',
    href: '/news',
    disabled: true,
  },
];

export const FOOTER_LINKS = [{ label: '공지사항', href: '/notice' }] as const;
