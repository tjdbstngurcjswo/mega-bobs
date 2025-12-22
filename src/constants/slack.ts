export type CommandKeyword = '오늘' | '내일' | '모레' | '글피';

export const DEFAULT_KEYWORD = '오늘';

export const DAY_OFFSET_MAP: Record<CommandKeyword, number> = {
  오늘: 0,
  내일: 1,
  모레: 2,
  글피: 3,
};

export const WARM_KEYWORDS: (CommandKeyword | null)[] = [
  null,
  '오늘',
  '내일',
  '모레',
  '글피',
];
