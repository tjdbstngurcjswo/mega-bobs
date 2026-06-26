export const sectionClass =
  'bg-surface flex flex-col shadow-[var(--shadow-card)]';

export const menuBodyClass =
  'grid grid-cols-1 min-h-[280px] min-[640px]:grid-cols-3';

export const courseColumnClass = (isFirst: boolean) =>
  isFirst
    ? ''
    : 'min-[640px]:relative min-[640px]:before:content-[""] min-[640px]:before:absolute min-[640px]:before:left-0 min-[640px]:before:top-6 min-[640px]:before:bottom-6 min-[640px]:before:w-px min-[640px]:before:bg-line';

export const courseTabBarClass = 'flex gap-1 px-2 pt-0 pb-0 min-[640px]:hidden';

export const courseTabClass = (active: boolean) =>
  active
    ? 'flex-1 rounded-lg py-2.5 text-[13px] font-bold text-ink bg-accent dark:bg-line dark:text-cream text-center transition-colors'
    : 'flex-1 rounded-lg py-2.5 text-[13px] font-semibold text-muted bg-bg/80 text-center transition-colors hover:text-ink hover:bg-surface-warm';
