import dayjs from '@/lib/dayjs';

export const getRelativeTime = (pubDate: string): string => {
  const pub = dayjs(pubDate).tz();
  const now = dayjs().tz();
  const diffMin = now.diff(pub, 'minute');
  const diffHour = now.diff(pub, 'hour');
  const diffDay = now.diff(pub, 'day');

  if (diffMin < 1) return '방금';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay === 1) return '어제';
  if (diffDay < 7) return `${diffDay}일 전`;
  return pub.format('MM.DD');
};

export const stripHtml = (html: string): string =>
  html
    .replace(/<[^>]*>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&#x[0-9a-fA-F]+;/gi, '')
    .replace(/&#\d+;/g, '');

export const getSourceFromUrl = (url: string): string => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
};
