import { cn } from '@/utils/cn';

export const GAME_BG =
  'radial-gradient(ellipse 70% 60% at 15% 25%, rgba(74,127,193,0.22), transparent 65%),' +
  'radial-gradient(ellipse 60% 70% at 85% 75%, rgba(224,92,82,0.16), transparent 65%),' +
  'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(74,172,115,0.1), transparent 70%),' +
  'var(--color-bg)';

export const frameClass = (isFullView: boolean, isWiggling?: boolean) =>
  cn(
    'flex flex-col',
    isFullView
      ? 'h-full'
      : 'overflow-hidden shadow-[0_4px_28px_rgba(0,0,0,0.18),_0_1px_4px_rgba(0,0,0,0.10)]',
    isWiggling && 'animate-[shake_0.4s_ease-in-out]'
  );
