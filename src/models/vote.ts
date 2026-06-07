/** 맛 평가 투표 방향 */
export type VoteType = 'up' | 'down';

/** 단일 메뉴의 집계된 투표 결과 */
export type VoteResult = {
  /** `{date}_{category}` 형식의 메뉴 식별자 */
  menuKey: string;
  up_count: number;
  down_count: number;
  /** 현재 사용자의 투표 (`null`이면 미투표) */
  myVote: VoteType | null;
};

/** 식전 코스 픽 선택지 (`pass`는 미선택) */
export type PickType = 'COURSE_1' | 'COURSE_2' | 'TAKE_OUT' | 'pass';

/** 특정 날짜의 식전 픽 집계 결과 */
export type PickResult = {
  /** YYYY-MM-DD */
  date: string;
  counts: Record<PickType, number>;
  /** 현재 사용자의 픽 (`null`이면 미선택) */
  myPick: PickType | null;
};
