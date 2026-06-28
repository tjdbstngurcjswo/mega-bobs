export const backdropClass = 'fixed inset-0 z-40 bg-black/30';

// 우측 엣지, 하단 8% 위치
export const containerClass =
  'fixed right-0 bottom-[8%] z-50 flex items-end gap-2';

// 세로 탭 버튼 — 검정
export const fabClass =
  'flex items-center justify-center bg-(--color-ink) px-1.5 py-2 sm:px-2 sm:py-3 cursor-pointer hover:opacity-80 transition-opacity shadow-[-3px_0_12px_rgba(0,0,0,0.16)]';

export const fabTextClass =
  'text-[9px] sm:text-[11px] font-[800] text-(--color-bg) tracking-[0.08em] select-none';

// 팝업 — FAB 버튼에서 펼쳐지는 애니메이션
export const popupClass =
  'relative w-[210px] bg-(--color-surface) shadow-[-8px_0_32px_rgba(0,0,0,0.22)] outline outline-1 outline-(--color-line) animate-popup-from-fab';

// 말풍선 꼬리 — 오른쪽 방향 삼각형
export const tailClass =
  'absolute -right-[7px] bottom-10 w-3 h-3 rotate-45 bg-(--color-surface) border-r border-t border-(--color-line)';

export const headerClass = 'flex items-center justify-between px-3 pt-3 pb-1';

export const titleClass =
  'text-[12px] font-[800] text-(--color-ink) tracking-[-0.02em]';

export const closeClass =
  'text-(--color-muted) hover:text-(--color-ink) leading-none cursor-pointer';

export const subtitleClass = 'px-3 pb-2.5 text-[11px] text-(--color-ink-2)';

export const scoresClass = 'flex gap-1 px-3 pb-2.5';

const scoreButtonBase =
  'w-7 h-7 flex items-center justify-center text-[12px] font-[700] cursor-pointer transition-colors';

export const scoreButtonIdle = `${scoreButtonBase} bg-(--color-surface-warm) text-(--color-ink-2)`;

export const scoreButtonActive = `${scoreButtonBase} bg-(--color-accent) text-(--color-ink)`;

export const hintClass = 'px-3 pb-2.5 text-[10px] text-(--color-muted)';

export const reasonClass =
  'mx-3 mb-2.5 w-[calc(100%-24px)] resize-none border border-(--color-line) bg-(--color-surface-warm) p-2 text-[11.5px] text-(--color-ink) placeholder:text-(--color-muted) focus:outline-none focus:border-(--color-ink-2)';

export const submitClass =
  'mx-3 mb-3 w-[calc(100%-24px)] bg-(--color-accent) py-1.5 text-[11.5px] font-[700] text-(--color-ink) cursor-pointer hover:bg-(--color-accent-deep) transition-colors';

export const doneClass =
  'flex flex-col items-center justify-center gap-1.5 px-3 py-5 text-center';

export const doneTitleClass = 'text-[13px] font-[800] text-(--color-ink)';

export const doneSubClass = 'text-[11px] text-(--color-ink-2)';
