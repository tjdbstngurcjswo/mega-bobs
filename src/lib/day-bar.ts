export const chipBg = (isSelected: boolean, isToday: boolean): string => {
  if (!isSelected) return 'bg-transparent hover:bg-surface-warm';
  return isToday ? 'bg-accent' : 'bg-ink';
};

const dowColor = (dow: number): string | null => {
  if (dow === 0) return 'text-red-500';
  if (dow === 6) return 'text-blue-500';
  return null;
};

export const labelClass = (isSelected: boolean, isToday: boolean, dow: number): string => {
  if (isSelected) return isToday ? 'text-ink/55' : 'text-white/60';
  return dowColor(dow) ?? 'text-muted';
};

export const dateClass = (isSelected: boolean, isToday: boolean, dow: number): string => {
  if (isSelected) return isToday ? 'text-ink' : 'text-white';
  return dowColor(dow) ?? 'text-ink';
};
