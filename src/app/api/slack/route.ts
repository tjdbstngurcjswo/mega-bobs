import {NextRequest, NextResponse} from 'next/server';

import {MENU_CATEGORIES, MenuCategoryLabel} from '@/constants/menu';
import {
  CommandKeyword,
  DAY_OFFSET_MAP,
  DEFAULT_KEYWORD,
} from '@/constants/slack';
import {seoulNow} from '@/lib/dayjs';
import {formatYYYYMMDD} from '@/lib/utils';
import {MenuCategory, MenuType} from '@/types/menu';

const toDateInfo = (text: string | null) => {
  const keyword = (text || '').trim() as CommandKeyword;
  const base = seoulNow(); // server runs in UTC, force Asia/Seoul

  if (!keyword) {
    const date = formatYYYYMMDD(base.toDate());
    return {keyword: DEFAULT_KEYWORD, date};
  }

  const offset = DAY_OFFSET_MAP[keyword];
  if (offset === undefined) return null;

  const date = formatYYYYMMDD(base.add(offset, 'day').toDate());
  return {keyword, date};
};

const toCategoryLabel = (category: MenuCategory) => {
  if (!category) return '';
  return MenuCategoryLabel[category].ko;
};

const toSlackFormat = (records: MenuType[], keyword: string, date: string) => {
  const header = `🍱 MegaBobs *${keyword} 메뉴 (${date})*`;

  const sections = MENU_CATEGORIES.map((category) => {
    const label = toCategoryLabel(category);
    const record = records.find((r) => r.category === category);
    const items = record?.items ?? [];

    if (!items.length) return `_${label}: 메뉴 없음_`;

    const lines = items.map((item) =>
      item.kcal ? `• ${item.name} (${item.kcal} kcal)` : `• ${item.name}`
    );
    return [`*${label}*`, ...lines].join('\n');
  }).join('\n\n');

  return sections ? [header, sections].join('\n\n') : header;
};

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const origin = req.nextUrl.origin;
  const text = form.get('text') as string | null;

  const dateInfo = toDateInfo(text);

  if (!dateInfo) {
    return NextResponse.json({
      response_type: 'ephemeral',
      text: "지원하지 않는 날짜 형식입니다. '오늘', '내일', '모레', '글피'만 지원합니다.",
    });
  }

  const {keyword, date} = dateInfo;

  const url = `${origin}/api/menu?start=${date}&end=${date}`;

  const internalRes = await fetch(url, {next: {revalidate: 86400}});

  if (!internalRes.ok) {
    return NextResponse.json({
      response_type: 'ephemeral',
      text: '메뉴 정보를 가져오지 못했습니다. 잠시 후 다시 시도해주세요.',
    });
  }

  const menus: MenuType[] = await internalRes.json();

  const textResponse = toSlackFormat(menus, keyword, date);

  return NextResponse.json({
    response_type: 'in_channel', // 채널 전체에 보이게
    text: textResponse,
  });
}
