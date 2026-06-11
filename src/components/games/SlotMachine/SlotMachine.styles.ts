import { cn } from '@/utils/cn';

export const gameZoneClass = (isFullscreen: boolean) =>
  cn(
    'bg-[linear-gradient(135deg,#c5d4f0_0%,#e8eef8_45%,#d5c8f0_100%)] flex flex-col gap-4',
    isFullscreen
      ? 'fixed inset-0 z-50 p-8 items-center justify-center overflow-auto'
      : 'rounded-2xl p-5'
  );

export const gameZoneInnerClass = (isFullscreen: boolean) =>
  isFullscreen ? 'w-full max-w-sm flex flex-col gap-4' : 'w-full flex flex-col gap-4';

export const cabinetClass =
  'bg-white/50 backdrop-blur-xl rounded-xl overflow-hidden shadow-[inset_0_0_0_1px_rgba(255,255,255,0.7),0_4px_24px_rgba(0,0,0,.08)]';

export const dotGroupClass = 'flex gap-2';

export const dotClass = 'w-1.5 h-1.5 rounded-full bg-accent';

export const fullscreenBtnClass =
  'w-[28px] h-[28px] bg-white/40 text-ink/50 text-[13px] rounded-md flex items-center justify-center cursor-pointer hover:bg-white/70 hover:text-ink/80 transition-colors';

export const reelsAreaClass = 'px-4 py-4';

export const winnerBannerClass = (show: boolean) =>
  cn(
    'text-[11px] font-black tracking-[0.35em] uppercase text-center transition-opacity duration-300',
    show ? 'text-accent-text opacity-100' : 'opacity-0 pointer-events-none'
  );

export const controlRowClass = 'flex items-center gap-3 px-4 pb-4';

export const spinBtnClass =
  'flex-1 h-[52px] bg-accent text-ink text-[15px] font-black rounded-lg flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-opacity hover:opacity-90 active:opacity-80';

export const inputClass = (isDuplicate: boolean) =>
  cn(
    'flex-1 h-[44px] bg-white/50 backdrop-blur-sm rounded-lg px-4 text-[14px] text-ink placeholder:text-ink/30 outline-none focus:bg-white/70 transition-colors disabled:opacity-40',
    isDuplicate && 'animate-[wiggle_0.3s_ease-in-out]'
  );

export const addBtnClass =
  'h-[44px] w-[44px] bg-white/40 text-ink-2 text-[20px] font-bold rounded-lg flex items-center justify-center cursor-pointer disabled:opacity-40 hover:bg-white/60 shrink-0 transition-colors';

export const participantsLabelClass =
  'text-ink/40 text-[10px] font-bold tracking-widest uppercase';

export const chipClass = (isWinner: boolean) =>
  cn(
    'flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold rounded-lg transition-all',
    isWinner ? 'bg-accent text-ink font-extrabold' : 'bg-white/50 text-ink-2'
  );

export const chipXClass =
  'text-ink/30 text-[10px] leading-none cursor-pointer hover:text-ink/60 transition-colors';
