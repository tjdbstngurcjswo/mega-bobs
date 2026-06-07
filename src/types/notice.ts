export type NoticeEnv = 'development' | 'production';

export type Notice = {
  id: string;
  title: string;
  body: string;
  publishedAt: string;
  env: NoticeEnv[];
};

export type Maker = {
  name: string;
  role: string;
  email: string;
  github: string;
  slack: string;
};

export type NoticeData = {
  notices: Notice[];
  makers: Maker[];
};
