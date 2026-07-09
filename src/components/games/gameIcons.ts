import { Dices, Shuffle, Zap } from 'lucide-react';

export const GAME_ICON_MAP = {
  ladder: Shuffle,
  slot: Dices,
  balloon: Zap,
} as const;

export const getGameIcon = (slug: string) =>
  GAME_ICON_MAP[slug as keyof typeof GAME_ICON_MAP] ?? GAME_ICON_MAP.ladder;
