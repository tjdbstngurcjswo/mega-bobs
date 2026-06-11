import { cn } from '@/utils/cn';

export const reelWrapClass = 'w-full';

export const reelWindowClass =
  'overflow-hidden relative bg-white/30 backdrop-blur-sm rounded-lg shadow-[inset_0_0_0_1px_rgba(255,255,255,0.5)]';

export const reelItemClass = (
  isCenter: boolean,
  isWinner: boolean,
  stopped: boolean
) =>
  cn(
    'absolute inset-x-0 flex items-center justify-center text-center px-4 truncate select-none',
    isCenter
      ? cn(
          'text-[30px] font-black tracking-tight',
          isWinner
            ? 'bg-accent/30 mx-2 rounded-lg text-ink'
            : 'text-ink'
        )
      : cn(
          'text-[13px] font-semibold',
          stopped ? 'text-ink/30' : 'text-ink/15'
        )
  );

export const fadeTopClass =
  'absolute inset-x-0 top-0 h-[80px] bg-gradient-to-b from-white/30 to-transparent pointer-events-none z-10';

export const fadeBottomClass =
  'absolute inset-x-0 bottom-0 h-[80px] bg-gradient-to-t from-white/30 to-transparent pointer-events-none z-10';
