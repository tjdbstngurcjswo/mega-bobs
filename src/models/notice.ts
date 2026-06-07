/** 공지사항이 노출될 배포 환경 */
type NoticeEnv = 'development' | 'production';

/** 공지사항 */
export type Notice = {
  id: string;
  title: string;
  body: string;
  /** ISO 8601 날짜 문자열 */
  publishedAt: string;
  /** 노출 대상 환경 목록 */
  env: NoticeEnv[];
};
