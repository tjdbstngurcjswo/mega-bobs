export const getVoterId = (): string => {
  if (typeof window === 'undefined') return '';
  const key = 'voter-id';
  const stored = localStorage.getItem(key);
  if (stored) return stored;
  const id = crypto.randomUUID();
  localStorage.setItem(key, id);
  return id;
};
