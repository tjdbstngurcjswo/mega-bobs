export type Notice = {
  id: string;
  title: string;
  body: string;
  publishedAt: string;
  isNew: boolean;
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
