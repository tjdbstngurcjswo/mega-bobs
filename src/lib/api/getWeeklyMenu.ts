import 'server-only';

import {MenuType} from '@/types/MenuType';

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
};

const getWeeklyMenu = async ({start, end}: {start: string; end: string}) => {
  const url = `${getBaseUrl()}/api/weekly-menu?start=${start}&end=${end}`;
  const res = await fetch(url, {next: {revalidate: 21600}});
  const body = (await res.json().catch(() => null)) as
    | MenuType[]
    | {message?: string}
    | null;

  if (!res.ok) {
    const message =
      (body as {message?: string} | null)?.message ??
      'Failed to fetch weekly menu';
    throw new Error(message);
  }

  return ((body as MenuType[] | null) ?? []) satisfies MenuType[];
};

export default getWeeklyMenu;
