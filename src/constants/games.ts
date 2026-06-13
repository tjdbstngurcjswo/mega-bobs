import type { LucideIcon } from 'lucide-react';
import { Coins, WavesLadder } from 'lucide-react';

type GameStatus = 'open' | 'coming_soon';

export type GameDef = {
  slug: string;
  name: string;
  description: string;
  status: GameStatus;
  icon: LucideIcon;
};

export const GAMES: GameDef[] = [
  {
    slug: 'ladder',
    name: '사다리게임',
    description: '내가 걸릴 리 없어… 정말?',
    status: 'open',
    icon: WavesLadder,
  },
  {
    slug: 'slot',
    name: '슬롯머신',
    description: '딱 한 명, 운명의 주인공을 뽑아요',
    status: 'coming_soon',
    icon: Coins,
  },
];
