import crypto from 'crypto';

import { NextRequest } from 'next/server';

import { err } from '@/lib/apiResponse';
import { MenuType } from '@/models/menu';

import { getCachedMenu, toDateInfo, toSlackFormat } from './_utils';

const verifySlackSignature = (
  body: string,
  timestamp: string | null,
  signature: string | null
): boolean => {
  const secret = process.env.SLACK_SIGNING_SECRET;
  if (!secret) return true; // dev 환경 — 검증 생략

  if (!timestamp || !signature) return false;

  // 5분 이상 지난 요청 거부 (replay attack 방지)
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;

  const sigBase = `v0:${timestamp}:${body}`;
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(sigBase);
  const expected = `v0=${hmac.digest('hex')}`;

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expected)
    );
  } catch {
    return false;
  }
};

export const POST = async (req: NextRequest) => {
  const timestamp = req.headers.get('x-slack-request-timestamp');
  const signature = req.headers.get('x-slack-signature');

  // body를 text로 먼저 읽어 서명 검증 + FormData 파싱에 재사용
  const rawBody = await req.text();

  if (!verifySlackSignature(rawBody, timestamp, signature)) {
    return err('Unauthorized', 401);
  }

  const form = new URLSearchParams(rawBody);
  const text = form.get('text');

  const dateInfo = toDateInfo(text);

  if (!dateInfo) {
    return Response.json({
      response_type: 'ephemeral',
      text: "지원하지 않는 날짜 형식이에요. '오늘', '내일', '모레', '글피'만 사용할 수 있어요",
    });
  }

  const { keyword, date } = dateInfo;

  let menus: MenuType[];
  try {
    menus = await getCachedMenu(date);
  } catch {
    return Response.json({
      response_type: 'ephemeral',
      text: '메뉴 정보를 가져오지 못했어요. 잠시 후 다시 시도해 주세요',
    });
  }

  const textResponse = toSlackFormat(menus, keyword, date);

  return Response.json({
    response_type: 'in_channel',
    text: textResponse,
  });
};
