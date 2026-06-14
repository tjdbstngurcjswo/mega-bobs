/** 리뉴얼 피드백 제출 페이로드 */
export type RenewalFeedbackPayload = {
  version: string;
  score: number; // 1–5
  reason?: string;
  page?: string; // 제출 시점의 pathname (e.g. "/", "/news")
};
