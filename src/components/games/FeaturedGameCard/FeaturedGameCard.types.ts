import type { GameDef } from '@/constants/games';

export type FeaturedGameCardProps = Omit<GameDef, 'status'>;
