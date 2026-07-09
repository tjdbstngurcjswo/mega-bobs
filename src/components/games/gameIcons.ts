import { Dices, Shuffle, Zap } from 'lucide-react';

export const GAME_ICON_MAP = {
  ladder: Shuffle,
  slot: Dices,
  balloon: Zap,
} as const;
