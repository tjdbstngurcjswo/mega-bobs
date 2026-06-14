export const containerClass =
  'fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2';

export const fabClass =
  'w-10 h-10 bg-(--color-ink) flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.18)] cursor-pointer hover:bg-(--color-board-2) transition-colors';

export const popupClass =
  'w-[220px] bg-(--color-surface) shadow-[0_4px_24px_rgba(0,0,0,0.14)] animate-slide-up';

export const headerClass = 'flex items-center justify-between px-4 pt-4 pb-1';

export const titleClass =
  'text-[13px] font-[800] text-(--color-ink) tracking-[-0.02em]';

export const closeClass =
  'text-(--color-muted) hover:text-(--color-ink) leading-none cursor-pointer';

export const subtitleClass = 'px-4 pb-3 text-[11.5px] text-(--color-ink-2)';

export const scoresClass = 'flex gap-1.5 px-4 pb-3';

export const scoreButtonBase =
  'w-8 h-8 flex items-center justify-center text-[13px] font-[700] cursor-pointer transition-colors';

export const scoreButtonIdle = `${scoreButtonBase} bg-(--color-surface-warm) text-(--color-ink-2)`;

export const scoreButtonActive = `${scoreButtonBase} bg-(--color-accent) text-(--color-ink)`;

export const hintClass = 'px-4 pb-3 text-[10px] text-(--color-muted)';

export const reasonClass =
  'mx-4 mb-3 w-[calc(100%-32px)] resize-none border border-(--color-line) bg-(--color-surface-warm) p-2 text-[12px] text-(--color-ink) placeholder:text-(--color-muted) focus:outline-none focus:border-(--color-ink-2)';

export const submitClass =
  'mx-4 mb-4 w-[calc(100%-32px)] bg-(--color-ink) py-2 text-[12px] font-[700] text-white cursor-pointer hover:bg-(--color-board-2) transition-colors';

export const doneClass =
  'flex flex-col items-center justify-center gap-2 px-4 py-6 text-center';

export const doneIconClass = 'w-7 h-7';

export const doneTitleClass = 'text-[13px] font-[800] text-(--color-ink)';
