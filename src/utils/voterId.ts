const VOTER_KEY = 'voter-id';

export const getVoterId = (): string => {
  if (typeof window === 'undefined') return '';
  const stored = localStorage.getItem(VOTER_KEY);
  if (stored) return stored;
  const id = crypto.randomUUID();
  localStorage.setItem(VOTER_KEY, id);
  return id;
};
