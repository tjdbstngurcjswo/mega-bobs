/** 슬랙 슬래시 커맨드 1회 호출 기록. 사용자 식별자는 저장하지 않는다. */
export type SlackCommandEvent = {
  keyword: string;
  /** 조회한 식단 날짜 (YYYY-MM-DD) */
  menuDate: string;
  cacheHit: boolean;
  /** 캐시에 메뉴가 저장된 시각 */
  cachedAt: string;
  durationMs: number;
};
