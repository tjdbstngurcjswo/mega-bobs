import {cn} from '@/lib/utils';

export const headerClass = (scrolled: boolean, menuOpen: boolean) =>
  cn(
    'sticky top-0 z-50 transition-all duration-300',
    scrolled || menuOpen ? 'bg-white/70 backdrop-blur-xl' : 'bg-transparent',
  );

export const desktopNavLinkClass = (active: boolean, disabled?: boolean) =>
  cn(
    'flex items-center gap-1.5 px-3 py-2 text-[13.5px] font-semibold',
    active ? 'text-ink shadow-[inset_0_-2px_0_var(--color-accent)]' : 'text-muted hover:text-ink-2',
    disabled && 'cursor-default opacity-50',
  );

export const bellSpanClass = (showDot: boolean) =>
  cn('origin-top', showDot && 'animate-[bellRingLoop_4s_ease-in-out_infinite]');

export const mobileOverlayClass = (menuOpen: boolean) =>
  cn(
    'fixed inset-x-0 bottom-0 top-14 z-40 min-[641px]:hidden',
    'bg-[var(--color-bg)]',
    'transition-all duration-200 ease-in-out',
    menuOpen
      ? 'pointer-events-auto translate-y-0 opacity-100'
      : 'pointer-events-none -translate-y-2 opacity-0',
  );

export const mobileNavLinkClass = (active: boolean, disabled?: boolean) =>
  cn(
    'flex items-center justify-between border-b border-line/50 py-3.5 text-[15px] font-semibold',
    active ? 'text-ink' : 'text-ink-2',
    disabled && 'cursor-default opacity-40',
  );
