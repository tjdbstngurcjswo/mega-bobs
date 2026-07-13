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
    description: '랜덤이 필요할 때 사다리 한 판 어때요',
    status: 'open',
  },
  {
    slug: 'slot',
    name: '다음 게임',
    description: '어떤 게임이 좋을지 아직 고민 중이에요',
    status: 'coming_soon',
  },
  {
    slug: 'balloon',
    name: '또 다른 게임',
    description: '아이디어는 있는데 아직 비밀이에요',
    status: 'coming_soon',
  },
];
