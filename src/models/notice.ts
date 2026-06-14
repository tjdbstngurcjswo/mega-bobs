/** 공지사항 */
export type Notice = {
  id: string;
  title: string;
  body: string;
  /** ISO 8601 날짜 문자열 */
  publishedAt: string;
};
