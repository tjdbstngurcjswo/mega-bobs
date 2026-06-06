export type VoteType = 'up' | 'down';

export type VoteResult = {
  menuKey: string;
  up_count: number;
  down_count: number;
  myVote: VoteType | null;
};

export type PickType = 'A' | 'B' | 'takeout' | 'pass';

export type PickResult = {
  date: string;
  counts: Record<PickType, number>;
  myPick: PickType | null;
};
