import {
  Cloud,
  Crown,
  Dices,
  Flame,
  Heart,
  Leaf,
  Moon,
  Music,
  Sparkles,
  Star,
  Sun,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const AVATAR_KEYS = [
  'star', 'heart', 'flame', 'sun', 'moon', 'crown',
  'leaf', 'cloud', 'dices', 'music', 'sparkles', 'zap',
] as const;

export type AvatarKey = (typeof AVATAR_KEYS)[number];

const ICON_MAP: Record<AvatarKey, LucideIcon> = {
  star: Star, heart: Heart, flame: Flame, sun: Sun, moon: Moon, crown: Crown,
  leaf: Leaf, cloud: Cloud, dices: Dices, music: Music, sparkles: Sparkles, zap: Zap,
};

export const getAvatarIcon = (key: string): LucideIcon =>
  ICON_MAP[key as AvatarKey] ?? Star;

export const getNextAvatarKey = (used: string[]): AvatarKey => {
  const usedSet = new Set(used);
  return (
    AVATAR_KEYS.find((k) => !usedSet.has(k)) ??
    AVATAR_KEYS[used.length % AVATAR_KEYS.length]
  );
};
