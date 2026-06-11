import { cn } from '@/utils/cn';

// ── Game zone — 그라디언트 배경 래퍼 ─────────────────────────────────────────

export const gameZoneClass =
  'bg-[linear-gradient(135deg,#1e2452_0%,#111720_55%,#1a1038_100%)] rounded-2xl p-5 flex flex-col gap-4';

// ── Glass cabinet ─────────────────────────────────────────────────────────────

export const cabinetClass =
  'bg-white/[0.07] backdrop-blur-xl rounded-xl overflow-hidden shadow-[inset_0_0_0_1px_rgba(255,255,255,0.09)]';

export const cabinetTitleClass =
  'text-white/40 text-[10px] font-bold tracking-[0.4em] uppercase';

export const dotGroupClass = 'flex gap-2';

export const dotClass = 'w-1.5 h-1.5 rounded-full bg-accent/80';

// ── Reels area ────────────────────────────────────────────────────────────────

export const reelsAreaClass = 'px-4 py-4';

// ── Winner banner ─────────────────────────────────────────────────────────────

export const winnerBannerClass = (show: boolean) =>
  cn(
    'text-[11px] font-black tracking-[0.35em] uppercase text-center transition-opacity duration-300',
    show ? 'text-accent opacity-100' : 'opacity-0 pointer-events-none'
  );

// ── Controls ──────────────────────────────────────────────────────────────────

export const controlRowClass = 'flex items-center gap-3 px-4 pb-4';

export const spinBtnClass =
  'flex-1 h-[52px] bg-accent text-ink text-[15px] font-black rounded-lg flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-opacity hover:opacity-90 active:opacity-80';

export const resetBtnClass =
  'w-[52px] h-[52px] bg-white/10 text-white/70 text-[18px] rounded-lg flex items-center justify-center cursor-pointer disabled:opacity-30 hover:bg-white/20 transition-colors';

// ── Input ─────────────────────────────────────────────────────────────────────

export const inputClass = (isDuplicate: boolean) =>
  cn(
    'flex-1 h-[44px] bg-white/10 backdrop-blur-sm rounded-lg px-4 text-[14px] text-white placeholder:text-white/30 outline-none focus:bg-white/15 transition-colors disabled:opacity-40',
    isDuplicate && 'animate-[wiggle_0.3s_ease-in-out]'
  );

export const addBtnClass =
  'h-[44px] w-[44px] bg-white/10 text-white/70 text-[20px] font-bold rounded-lg flex items-center justify-center cursor-pointer disabled:opacity-40 hover:bg-white/20 shrink-0 transition-colors';

// ── Participants ──────────────────────────────────────────────────────────────

export const participantsLabelClass =
  'text-white/40 text-[10px] font-bold tracking-widest uppercase';

export const chipClass = (isWinner: boolean) =>
  cn(
    'flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold rounded-lg transition-all',
    isWinner ? 'bg-accent text-ink font-extrabold' : 'bg-white/10 text-white/80'
  );

export const chipXClass =
  'text-white/40 text-[10px] leading-none cursor-pointer hover:text-white/70 transition-colors';

export const hintClass = 'text-muted text-[13px] text-center py-1';
