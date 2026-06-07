import {cn} from '@/utils/utils';

export const todayButtonClass = (isActive: boolean) =>
  cn(
    'flex items-center gap-1.5 border border-accent/50 bg-accent-soft px-3 py-1 text-[11px] font-bold text-accent-text transition-opacity hover:opacity-70',
    isActive ? 'invisible' : 'visible',
  );
