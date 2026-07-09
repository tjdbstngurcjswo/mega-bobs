const EMOJI_AVATARS = [
  '🐱', '🐶', '🐻', '🐼', '🦊', '🐰', '🐸', '🐧',
  '🦁', '🐯', '🐨', '🦄', '🐙', '🐝', '🦋', '🐺',
] as const;

export const getNextEmoji = (used: string[]): string => {
  const usedSet = new Set(used);
  return (
    EMOJI_AVATARS.find((e) => !usedSet.has(e)) ??
    EMOJI_AVATARS[used.length % EMOJI_AVATARS.length]
  );
};
