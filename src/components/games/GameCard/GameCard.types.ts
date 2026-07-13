import type { GameDef } from '@/constants/games';

export type GameCardProps = Omit<GameDef, 'status'> & { number: number };
