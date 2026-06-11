import { cn } from '@/utils/cn';

export const reelWrapClass = 'w-full';

// White reel window — sharp gold payline lines, no blur
export const reelWindowClass = 'h-[220px] overflow-hidden relative bg-white';

// relative + z-[1] ensures item text stacks above the absolute pay-line fill
export const reelContentClass = 'flex flex-col relative z-[1]';

export const reelTopItemClass = (stopped: boolean) =>
  cn(
    'h-[60px] flex items-center justify-center text-[13px] font-bold text-ink-2 text-center px-4 truncate transition-opacity duration-75',
    stopped ? 'opacity-40' : 'opacity-20'
  );

export const reelMiddleItemClass = (stopped: boolean, isWinner: boolean) =>
  cn(
    'h-[100px] flex items-center justify-center text-[34px] font-black text-center tracking-tight leading-tight px-4 truncate transition-all duration-150',
    isWinner
      ? 'bg-accent text-ink scale-105 animate-[wiggle_0.4s_ease-in-out]'
      : stopped
        ? 'text-ink'
        : 'text-ink opacity-60'
  );

export const reelBottomItemClass = (stopped: boolean) =>
  cn(
    'h-[60px] flex items-center justify-center text-[13px] font-bold text-ink-2 text-center px-4 truncate transition-opacity duration-75',
    stopped ? 'opacity-40' : 'opacity-20'
  );

// Pay-line overlays — crisp gold lines, no glow/blur
export const payLineFillClass =
  'absolute inset-x-0 top-[60px] h-[100px] bg-[rgba(226,192,76,0.06)] pointer-events-none';

export const payLineTopBorderClass =
  'absolute inset-x-0 top-[60px] h-[2px] bg-accent pointer-events-none';

export const payLineBottomBorderClass =
  'absolute inset-x-0 top-[158px] h-[2px] bg-accent pointer-events-none';

// Fade overlays — white fade to hide top/bottom items
export const fadeTopClass =
  'absolute inset-x-0 top-0 h-[60px] bg-gradient-to-b from-white to-transparent pointer-events-none z-10';

export const fadeBottomClass =
  'absolute inset-x-0 bottom-0 h-[60px] bg-gradient-to-t from-white to-transparent pointer-events-none z-10';
