import { cn } from '@/utils/cn';

export const headerClass = (scrolled: boolean, menuOpen: boolean) =>
  cn(
    'sticky top-0 z-50 transition-all duration-300',
    (scrolled || menuOpen) && 'backdrop-blur-md'
  );

export const logoLinkClass =
  'text-ink text-[17px] font-extrabold tracking-tight';

export const desktopNavClass =
  'flex flex-1 gap-0.5 overflow-x-auto whitespace-nowrap max-[640px]:hidden';

export const desktopNavLinkClass = (active: boolean) =>
  cn(
    'flex items-center gap-1.5 px-3 py-2 text-[13.5px] font-semibold',
    active ? 'text-ink' : 'text-muted hover:text-ink-2'
  );

export const desktopBellLinkClass =
  'text-ink-2 relative flex size-9 items-center justify-center max-[640px]:hidden';

export const bellSpanClass = (showDot: boolean) =>
  cn('origin-top', showDot && 'animate-[bellRingLoop_4s_ease-in-out_infinite]');

export const bellDotClass = 'bg-accent absolute top-[7px] right-[6px] size-1.5';

export const mobileBellLinkClass =
  'text-ink-2 relative flex size-11 items-center justify-center';

export const mobileMenuButtonClass =
  'text-ink-2 flex size-11 items-center justify-center';

export const mobileOverlayClass = (menuOpen: boolean) =>
  cn(
    'fixed inset-x-0 bottom-0 top-14 z-40 min-[641px]:hidden',
    'bg-[var(--color-bg)]',
    'transition-all duration-200 ease-in-out',
    menuOpen
      ? 'pointer-events-auto translate-y-0 opacity-100'
      : 'pointer-events-none -translate-y-2 opacity-0'
  );

export const mobileNavLinkClass = (active: boolean) =>
  cn(
    'flex items-center justify-between border-b border-line/50 py-3.5 text-[15px] font-semibold',
    active ? 'text-accent-text' : 'text-ink-2'
  );
