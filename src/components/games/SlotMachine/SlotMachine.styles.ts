import { cn } from '@/utils/cn';

// ── Cabinet ──────────────────────────────────────────────────────────────────

export const cabinetClass =
  'bg-board overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,.35)]';

export const cabinetHeaderClass =
  'bg-board-2 flex items-center justify-between px-5 py-3.5';

export const cabinetTitleClass =
  'text-accent text-[11px] font-black tracking-[0.4em] uppercase';

export const dotGroupClass = 'flex gap-2';

export const dotClass = 'w-2 h-2 rounded-full bg-accent';

// ── Reels area ────────────────────────────────────────────────────────────────

export const reelsAreaClass = 'bg-[#0d1018] px-5 py-6';

// ── Winner banner ─────────────────────────────────────────────────────────────

export const winnerBannerClass = (show: boolean) =>
  cn(
    'text-[11px] font-black tracking-[0.4em] uppercase transition-opacity duration-300',
    show ? 'text-accent opacity-100' : 'opacity-0 pointer-events-none'
  );

// ── Controls ──────────────────────────────────────────────────────────────────

export const controlRowClass =
  'bg-board-2 flex items-center gap-3 px-4 py-4';

export const spinBtnClass =
  'flex-1 h-[52px] bg-accent text-ink text-[15px] font-black tracking-tight flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-opacity hover:opacity-90 active:opacity-80';

export const resetBtnClass =
  'w-[52px] h-[52px] bg-board text-cream-2 text-[18px] flex items-center justify-center cursor-pointer disabled:opacity-30 hover:text-cream transition-colors';

// ── Input ─────────────────────────────────────────────────────────────────────

export const inputClass = (isDuplicate: boolean) =>
  cn(
    'flex-1 h-[44px] bg-surface shadow-[var(--shadow-flat)] px-4 text-[14px] text-ink placeholder:text-muted outline-none focus:shadow-[var(--shadow-card)] transition-shadow disabled:opacity-40 disabled:cursor-not-allowed',
    isDuplicate && 'animate-[wiggle_0.3s_ease-in-out]'
  );

export const addBtnClass =
  'h-[44px] w-[44px] bg-board text-cream text-[20px] font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0 flex items-center justify-center';

// ── Participants ──────────────────────────────────────────────────────────────

export const participantsLabelClass =
  'text-muted text-[11px] font-bold tracking-widest uppercase';

export const chipClass = (isWinner: boolean) =>
  cn(
    'flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold transition-all',
    isWinner
      ? 'bg-accent text-ink font-extrabold shadow-[0_0_12px_rgba(226,192,76,0.55)]'
      : 'bg-surface-warm text-ink-2'
  );

export const chipXClass =
  'text-muted text-[10px] leading-none cursor-pointer hover:text-ink transition-colors';

export const hintClass = 'text-muted text-[13px] text-center py-1';
