export type VoteType = 'up' | 'down';

export type VoteResult = {
  menuKey: string;
  up_count: number;
  down_count: number;
  myVote: VoteType | null;
};
