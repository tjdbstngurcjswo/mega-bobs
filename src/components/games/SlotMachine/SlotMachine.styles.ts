import { cn } from '@/utils/cn';

// ── Cabinet ──────────────────────────────────────────────────────────────────

export const cabinetClass =
  'shadow-[0_8px_48px_rgba(0,0,0,.65)] overflow-hidden';

export const cabinetHeaderClass =
  'bg-[#07090f] flex items-center justify-between px-5 py-3';

export const cabinetTitleClass =
  'text-accent text-[11px] font-black tracking-[0.25em] uppercase';

export const dotGroupClass = 'flex gap-1.5';

export const dotClass = 'w-2 h-2 rounded-full bg-accent opacity-60';

// ── Reels area ────────────────────────────────────────────────────────────────

export const reelsAreaClass = 'bg-[#060a0e] py-6 px-5';

// ── Controls ──────────────────────────────────────────────────────────────────

export const controlRowClass =
  'bg-[#07090f] flex items-center gap-3 px-4 py-4';

export const spinBtnClass =
  'flex-1 h-[52px] bg-accent text-ink text-[15px] font-black tracking-tight flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-opacity';

export const resetBtnClass =
  'w-[52px] h-[52px] bg-[#1a2030] text-cream-2 text-[18px] flex items-center justify-center cursor-pointer disabled:opacity-30 hover:bg-[#222c3f] transition-colors';

// ── Input ─────────────────────────────────────────────────────────────────────

export const inputClass = (isDuplicate: boolean) =>
  cn(
    'flex-1 h-[44px] bg-surface shadow-[var(--shadow-flat)] px-4 text-[14px] text-ink placeholder:text-muted outline-none focus:shadow-[var(--shadow-card)] transition-shadow disabled:opacity-40 disabled:cursor-not-allowed',
    isDuplicate && 'animate-[wiggle_0.3s_ease-in-out]'
  );

export const addBtnClass =
  'h-[44px] px-5 bg-board text-cream text-[13px] font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0';

// ── Participants ──────────────────────────────────────────────────────────────

export const participantsLabelClass =
  'text-muted text-[11px] font-bold tracking-widest uppercase';

export const chipClass = (isWinner: boolean) =>
  cn(
    'flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold',
    isWinner ? 'bg-accent text-ink font-extrabold' : 'bg-surface-warm text-ink-2'
  );

export const chipXClass =
  'text-muted text-[10px] leading-none cursor-pointer hover:text-ink transition-colors';

export const hintClass = 'text-muted text-[13px] text-center py-1';
