import { cn } from '@/utils/cn';

export const removeButtonClass =
  'text-muted hover:text-ink absolute top-0.5 right-0.5 z-10 flex h-4 w-4 cursor-pointer items-center justify-center text-[10px] leading-none';

export const cellClass = (isClickable: boolean, isOpaque: boolean) =>
  cn(
    'flex w-full items-center justify-center py-2 transition-opacity',
    isClickable && 'cursor-pointer hover:opacity-75',
    isOpaque && 'opacity-40'
  );

export const emojiClass = 'font-emoji text-xl leading-none select-none';
