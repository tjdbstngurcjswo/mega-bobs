import {NextRequest, NextResponse} from 'next/server';

import {menuCategoryLabelMap} from '@/constants/menuCategory';
import dayjs from '@/lib/dayjs';
import {formatYYYYMMDD} from '@/lib/utils';

const TOMORROW = ['내일', 'tomorrow', 'tmr'];
const CATEGORIES = ['COURSE_1', 'COURSE_2', 'TAKE_OUT'] as const;

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
};

const isTomorrow = (text: string) => TOMORROW.includes(text);

const toDateString = (text: string) => {
  const base = dayjs(); // defaults to Asia/Seoul
  const target = isTomorrow(text) ? base.add(1, 'day') : base;
  return formatYYYYMMDD(target.toDate());
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

export async function POST(req: NextRequest) {
  const form = await req.formData();
  console.log(form);
  const text = ((form.get('text') as string) || '').trim();
  const date = toDateString(text);

  const url = `${getBaseUrl()}/api/menu?start=${date}&end=${date}`;

  const internalRes = await fetch(url);

  if (!internalRes.ok) {
    return NextResponse.json({
      response_type: 'ephemeral',
      text: '메뉴 정보를 가져오지 못했습니다. 잠시 후 다시 시도해주세요.',
    });
  }

  const menuJson = await internalRes.json();
  const records = toRecords(menuJson);

  // 슬랙 응답 포맷
  const header = `🍱 Megabobs *${text || '오늘'} 메뉴 (${date})*`;
  const sections = toSectionText(records);
  const textResponse = sections ? [header, sections].join('\n\n') : header;

  return NextResponse.json({
    response_type: 'in_channel', // 채널 전체에 보이게
    text: textResponse,
  });
}
