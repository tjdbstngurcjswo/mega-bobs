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
    description: '랜덤으로 점심 당번 뽑기',
    status: 'coming_soon',
  },
  {
    slug: 'slot',
    name: '슬롯머신',
    description: '오늘의 메뉴를 운에 맡겨봐요',
    status: 'coming_soon',
  },
  {
    slug: 'balloon',
    name: '풍선터뜨리기',
    description: '풍선을 터뜨려 결과를 확인하세요',
    status: 'coming_soon',
  },
];
