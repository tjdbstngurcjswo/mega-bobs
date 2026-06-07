type NoticeEnv = 'development' | 'production';

export type Notice = {
  id: string;
  title: string;
  body: string;
  publishedAt: string;
  env: NoticeEnv[];
};
