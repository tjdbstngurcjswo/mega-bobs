import { cn } from '@/utils/cn';

export const reelWrapClass = 'w-full';

export const reelWindowClass = 'h-[220px] overflow-hidden relative';

// relative + z-[1] ensures item text stacks above the absolute pay-line fill
export const reelContentClass = 'flex flex-col relative z-[1]';

export const reelTopItemClass = (stopped: boolean) =>
  cn(
    'h-[60px] flex items-center justify-center text-[13px] font-black text-cream-2 text-center px-4 truncate transition-opacity duration-75',
    stopped ? 'opacity-30' : 'opacity-10'
  );

export const reelMiddleItemClass = (stopped: boolean, isWinner: boolean) =>
  cn(
    'h-[100px] flex items-center justify-center text-[32px] font-black text-center tracking-tight leading-tight px-4 truncate transition-all duration-200',
    isWinner ? 'text-accent animate-[wiggle_0.5s_ease-in-out]' : 'text-cream'
  );

export const reelBottomItemClass = (stopped: boolean) =>
  cn(
    'h-[60px] flex items-center justify-center text-[13px] font-black text-cream-2 text-center px-4 truncate transition-opacity duration-75',
    stopped ? 'opacity-30' : 'opacity-10'
  );

// Pay-line overlays — painted behind reel content (z-index: auto < z-[1])
// Middle row: top-[60px], height 100px → bottom at top-[159px]
export const payLineFillClass =
  'absolute inset-x-0 top-[60px] h-[100px] bg-[rgba(226,192,76,0.07)] pointer-events-none';

export const payLineTopBorderClass =
  'absolute inset-x-0 top-[60px] h-px bg-[rgba(226,192,76,0.45)] pointer-events-none';

export const payLineBottomBorderClass =
  'absolute inset-x-0 top-[159px] h-px bg-[rgba(226,192,76,0.45)] pointer-events-none';

// Fade overlays — on top of everything (z-10)
export const fadeTopClass =
  'absolute inset-x-0 top-0 h-[60px] bg-gradient-to-b from-[#060a0e] to-transparent pointer-events-none z-10';

export const fadeBottomClass =
  'absolute inset-x-0 bottom-0 h-[60px] bg-gradient-to-t from-[#060a0e] to-transparent pointer-events-none z-10';
