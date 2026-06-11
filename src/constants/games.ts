type GameStatus = 'open' | 'coming_soon';

export type GameDef = {
  slug: string;
  name: string;
  description: string;
  status: GameStatus;
};

export const GAMES: GameDef[] = [
  {
    slug: 'ladder',
    name: '사다리게임',
    description: '내가 걸릴 리 없어… 정말?',
    status: 'coming_soon',
  },
  {
    slug: 'slot',
    name: '슬롯머신',
    description: '이름을 넣고 돌리면 딱 한 명이 뽑혀요',
    status: 'open',
  },
  {
    slug: 'balloon',
    name: '풍선터뜨리기',
    description: '터뜨린 사람이 오늘의 주인공',
    status: 'coming_soon',
  },
];
