import {cn} from '@/utils/utils';

export const navButtonClass = (canGo: boolean) =>
  cn(
    'flex min-h-[44px] w-8 shrink-0 cursor-pointer flex-col items-center justify-center gap-0.5 transition-opacity duration-100 active:scale-75',
    canGo ? 'text-muted hover:text-ink' : 'cursor-default opacity-25',
  );
