import { after, NextRequest, NextResponse } from 'next/server';

import { isMenuCacheHit } from './_cache';
import { reportSlackCommand } from './_report';
import { getCachedMenu, toDateInfo, toSlackFormat } from './_utils';

/**
 * @route POST /api/slack
 * @body FormData `text` — '오늘' | '내일' | '모레' | '글피' (없으면 오늘)
 * @returns Slack 메시지 응답 (in_channel 또는 ephemeral)
 */
const hasSlackUser = (value: FormDataEntryValue | null) =>
  typeof value === 'string' && value.length > 0;

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

  const startedAt = Date.now();
  const { keyword, date } = dateInfo;

  let cached: Awaited<ReturnType<typeof getCachedMenu>>;
  try {
    cached = await getCachedMenu(date);
  } catch {
    return NextResponse.json({
      response_type: 'ephemeral',
      text: '메뉴 정보를 가져오지 못했어요. 잠시 후 다시 시도해 주세요',
    });
  }

  const cacheHit = isMenuCacheHit(cached.cachedAt, startedAt);
  const textResponse = toSlackFormat(cached.menus, keyword, date);

  after(() =>
    reportSlackCommand({
      track: hasSlackUser(form.get('user_id')),
      keyword,
      date,
      cacheHit,
      durationMs: Date.now() - startedAt,
    })
  );

  return NextResponse.json(
    {
      response_type: 'in_channel',
      text: textResponse,
    },
    {
      headers: {
        'x-menu-cache': cacheHit ? 'hit' : 'miss',
        'x-menu-cached-at': String(cached.cachedAt),
      },
    }
  );
};
