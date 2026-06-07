import {unstable_cache} from 'next/cache';

import {MENU_CATEGORIES, MenuCategoryLabel} from '@/constants/menu';
import {CommandKeyword, DAY_OFFSET_MAP, DEFAULT_KEYWORD} from '@/constants/slack';
import getMenu from '@/api/getMenu';
import dayjs, {SEOUL_TIMEZONE} from '@/lib/dayjs';
import {MenuCategory, MenuType} from '@/api/menu.types';

export const getCachedMenu = unstable_cache(
  (date: string) => getMenu({start: date, end: date}),
  ['slack-menu'],
  {tags: ['menu'], revalidate: 86400}
);

export const toDateInfo = (text: string | null) => {
  const keyword = (text || '').trim() as CommandKeyword;
  const base = dayjs().tz(SEOUL_TIMEZONE);

  if (!keyword) {
    const date = base.format('YYYY-MM-DD');
    return {keyword: DEFAULT_KEYWORD, date};
  }

  const offset = DAY_OFFSET_MAP[keyword];
  if (offset === undefined) return null;

  const date = base.add(offset, 'day').format('YYYY-MM-DD');
  return {keyword, date};
};

export const toCategoryLabel = (category: MenuCategory) => {
  if (!category) return '';
  return MenuCategoryLabel[category].ko;
};

export const toSlackFormat = (records: MenuType[], keyword: string, date: string) => {
  const header = `🍚 MegaBobs *${keyword} 메뉴 (${date})* 🍚`;

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
