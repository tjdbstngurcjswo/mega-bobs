import {NextRequest, NextResponse} from 'next/server';

import {menuCategoryLabelMap} from '@/constants/menuCategory';
import {seoulNow} from '@/lib/dayjs';
import {formatYYYYMMDD} from '@/lib/utils';

const DAY_KEYWORDS: Record<string, number> = {
  오늘: 0,
  내일: 1,
  모레: 2,
  글피: 3,
};
const DEFAULT_KEYWORD = '오늘';
const CATEGORIES = ['COURSE_1', 'COURSE_2', 'TAKE_OUT'] as const;

const toDateInfo = (text: string | null) => {
  const keyword = (text || '').trim();
  const base = seoulNow(); // server runs in UTC, force Asia/Seoul

  if (!keyword) {
    const date = formatYYYYMMDD(base.toDate());
    return {keyword: DEFAULT_KEYWORD, date};
  }

  const offset = DAY_KEYWORDS[keyword];
  if (offset === undefined) return null;

  const date = formatYYYYMMDD(base.add(offset, 'day').toDate());
  return {keyword, date};
};

const toRecords = (payload: any): any[] =>
  Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : [];

const toCategoryLabel = (category?: string) => {
  if (!category) return '';
  return (
    menuCategoryLabelMap[category as keyof typeof menuCategoryLabelMap]?.ko ??
    category
  );
};

const toSectionText = (records: any[]) => {
  return CATEGORIES.map((category) => {
    const label = toCategoryLabel(category);
    const record = records.find((r) => r?.category === category);
    const items = Array.isArray(record?.items) ? record.items : [];

    if (!items.length) return `_${label}: 메뉴 없음_`;

    const lines = items.map((item: {name: string; kcal?: number}) =>
      item.kcal ? `• ${item.name} (${item.kcal} kcal)` : `• ${item.name}`
    );
    return [`*${label}*`, ...lines].join('\n');
  }).join('\n\n');
};

const handleSlackRequest = async (origin: string, text: string | null) => {
  const dateInfo = toDateInfo(text);

  if (!dateInfo) {
    return NextResponse.json({
      response_type: 'ephemeral',
      text: "지원하지 않는 날짜 형식입니다. '오늘', '내일', '모레', '글피'만 지원합니다.",
    });
  }

  const {keyword, date} = dateInfo;

  const url = `${origin}/api/menu?start=${date}&end=${date}`;

  console.log('url', url);
  const internalRes = await fetch(url, {next: {revalidate: 86400}});

  if (!internalRes.ok) {
    return NextResponse.json({
      response_type: 'ephemeral',
      text: '메뉴 정보를 가져오지 못했습니다. 잠시 후 다시 시도해주세요.',
    });
  }

  const menuJson = await internalRes.json();
  const records = toRecords(menuJson);

  // 슬랙 응답 포맷
  const header = `🍱 Megabobs *${keyword} 메뉴 (${date})*`;
  const sections = toSectionText(records);
  const textResponse = sections ? [header, sections].join('\n\n') : header;

  return NextResponse.json({
    response_type: 'in_channel', // 채널 전체에 보이게
    text: textResponse,
  });
};

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const origin = req.nextUrl.origin;
  const text = form.get('text') as string | null;
  return handleSlackRequest(origin, text);
}

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const text = req.nextUrl.searchParams.get('text');
  return handleSlackRequest(origin, text);
}
