export const sectionClass =
  'bg-surface flex flex-col shadow-[var(--shadow-card)]';

export const menuBodyClass =
  'grid grid-cols-1 min-h-[280px] min-[640px]:grid-cols-3 min-[640px]:divide-x min-[640px]:divide-line';

export const courseTabBarClass = 'flex min-[640px]:hidden border-b border-line';

export const courseTabClass = (active: boolean) =>
  active
    ? 'flex-1 py-2.5 text-[13px] font-bold text-ink border-b-2 border-accent -mb-px text-center transition-colors'
    : 'flex-1 py-2.5 text-[13px] font-semibold text-muted text-center transition-colors hover:text-ink';
