const VOTER_KEY = 'voter-id';

/**
 * localStorage에서 익명 투표자 ID를 읽거나 최초 접근 시 생성해 저장한다.
 * SSR 환경에서는 빈 문자열을 반환한다.
 */
export const getVoterId = (): string => {
  if (typeof window === 'undefined') return '';
  const stored = localStorage.getItem(VOTER_KEY);
  if (stored) return stored;
  const id = crypto.randomUUID();
  localStorage.setItem(VOTER_KEY, id);
  return id;
};
