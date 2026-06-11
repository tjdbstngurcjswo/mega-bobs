import { cn } from '@/utils/cn';

export const reelWrapClass = 'w-full';

export const reelWindowClass =
  'h-[220px] overflow-hidden relative bg-white/[0.06] rounded-lg shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]';

// relative + z-[1] ensures item text stacks above the absolute pay-line fill
export const reelContentClass = 'flex flex-col relative z-[1]';

export const reelTopItemClass = (stopped: boolean) =>
  cn(
    'h-[60px] flex items-center justify-center text-[13px] font-bold text-center px-4 truncate transition-opacity duration-75',
    stopped ? 'text-white/40' : 'text-white/20'
  );

export const reelMiddleItemClass = (stopped: boolean, isWinner: boolean) =>
  cn(
    'h-[100px] flex items-center justify-center text-[34px] font-black text-center tracking-tight leading-tight px-4 truncate transition-all duration-150',
    isWinner
      ? 'bg-accent text-ink rounded-lg mx-2 scale-105 animate-[wiggle_0.4s_ease-in-out]'
      : stopped
        ? 'text-white'
        : 'text-white/60'
  );

export const reelBottomItemClass = (stopped: boolean) =>
  cn(
    'h-[60px] flex items-center justify-center text-[13px] font-bold text-center px-4 truncate transition-opacity duration-75',
    stopped ? 'text-white/40' : 'text-white/20'
  );

// 페이라인 없음 — glass 중앙 영역으로 구분
export const payLineFillClass = 'hidden';
export const payLineTopBorderClass = 'hidden';
export const payLineBottomBorderClass = 'hidden';

// Glass fade overlays
export const fadeTopClass =
  'absolute inset-x-0 top-0 h-[60px] bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none z-10';

export const fadeBottomClass =
  'absolute inset-x-0 bottom-0 h-[60px] bg-gradient-to-t from-white/[0.04] to-transparent pointer-events-none z-10';
