import { cn } from '@/utils/cn';

export const itemInputClass = (disabled: boolean) =>
  cn(
    'w-full bg-transparent px-0.5 py-1.5 text-center text-[9px] font-bold outline-none',
    'focus-visible:border-accent truncate border-b-2 border-transparent transition-colors',
    'text-ink-2',
    disabled && 'cursor-default'
  );
