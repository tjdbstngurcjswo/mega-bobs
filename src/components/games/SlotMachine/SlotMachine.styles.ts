import { cn } from '@/utils/cn';

export const inputClass = (isDuplicate: boolean) =>
  cn(
    'flex-1 h-[44px] bg-surface shadow-[var(--shadow-flat)] px-4 text-[14px] text-ink placeholder:text-muted outline-none focus:shadow-[var(--shadow-card)] transition-shadow disabled:opacity-40 disabled:cursor-not-allowed',
    isDuplicate && 'animate-[wiggle_0.3s_ease-in-out]'
  );

export const addBtnClass =
  'h-[44px] px-5 bg-board text-cream text-[13px] font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0';

export const drumWrapperClass = 'shadow-[var(--shadow-card)] overflow-hidden';

export const drumDisplayClass =
  'bg-board flex flex-col items-center justify-center gap-2 py-10 px-6';

export const statusLabelClass =
  'text-cream-2 text-[11px] font-bold tracking-widest uppercase';

export const drumNameClass =
  'text-accent text-[40px] font-black tracking-tight leading-none min-h-[48px] text-center';

export const resultBarClass =
  'bg-surface-warm flex items-center justify-between px-5 py-4';

export const resultLabelClass =
  'text-muted text-[11px] font-bold tracking-widest uppercase mb-0.5';

export const resultNameClass = 'text-ink text-[19px] font-black tracking-tight';

export const winnerBadgeClass =
  'bg-accent text-ink text-[11px] font-extrabold px-2.5 py-1 tracking-wide uppercase shrink-0';

export const controlRowClass = 'bg-surface flex gap-2 p-4';

export const spinBtnClass =
  'flex-1 h-[52px] bg-accent text-ink text-[15px] font-black tracking-tight flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';

export const resetBtnClass =
  'w-[52px] h-[52px] bg-surface-warm text-ink-2 text-[18px] flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-down-soft transition-colors';

export const participantsWrapperClass = 'bg-surface px-5 py-4';

export const participantsLabelClass =
  'text-muted text-[11px] font-bold tracking-widest uppercase mb-2';

export const chipClass = (isWinner: boolean) =>
  cn(
    'flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold',
    isWinner
      ? 'bg-accent text-ink font-extrabold'
      : 'bg-surface-warm text-ink-2'
  );

export const chipXClass =
  'text-muted text-[10px] leading-none cursor-pointer hover:text-ink transition-colors';

export const hintClass =
  'bg-surface px-5 py-4 text-muted text-[13px] text-center';

export const hintInlineClass = 'text-muted text-[12px] mt-2';
