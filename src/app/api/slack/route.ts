import { NextRequest, NextResponse } from 'next/server';

import { MenuType } from '@/models/menu';

import { getCachedMenu, toDateInfo, toSlackFormat } from './_utils';

/**
 * @route POST /api/slack
 * @body FormData `text` — '오늘' | '내일' | '모레' | '글피' (없으면 오늘)
 * @returns Slack 메시지 응답 (in_channel 또는 ephemeral)
 */
export const POST = async (req: NextRequest) => {
  const form = await req.formData();
  const text = form.get('text') as string | null;

  const dateInfo = toDateInfo(text);

  if (!dateInfo) {
    return NextResponse.json({
      response_type: 'ephemeral',
      text: "지원하지 않는 날짜 형식이에요. '오늘', '내일', '모레', '글피'만 사용할 수 있어요",
    });
  }

  const { keyword, date } = dateInfo;

  let menus: MenuType[];
  try {
    menus = await getCachedMenu(date);
  } catch {
    return NextResponse.json({
      response_type: 'ephemeral',
      text: '메뉴 정보를 가져오지 못했어요. 잠시 후 다시 시도해 주세요',
    });
  }

  const textResponse = toSlackFormat(menus, keyword, date);

  return NextResponse.json({
    response_type: 'in_channel',
    text: textResponse,
  });
};
