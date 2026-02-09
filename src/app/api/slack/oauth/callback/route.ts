import {NextRequest} from 'next/server';

import {supabaseServer} from '@/lib/supabase-server';

const SLACK_CLIENT_ID = process.env.SLACK_CLIENT_ID ?? '';
const SLACK_CLIENT_SECRET = process.env.SLACK_CLIENT_SECRET ?? '';

interface SlackOAuthResponse {
  ok: boolean;
  error?: string;
  access_token?: string;
  scope?: string;
  bot_user_id?: string;
  team?: {
    id: string;
    name: string;
  };
}

function htmlResponse(success: boolean, message: string, status = 200) {
  const emoji = success ? '🎉' : '❌';
  const title = success ? '설치 완료' : '설치 실패';

  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>MegaBobs Slack - ${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f5f5f5; }
    .card { background: white; border-radius: 12px; padding: 48px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1); max-width: 400px; }
    .emoji { font-size: 48px; margin-bottom: 16px; }
    h1 { margin: 0 0 12px; font-size: 24px; color: #1a1a1a; }
    p { color: #666; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="card">
    <div class="emoji">${emoji}</div>
    <h1>${title}</h1>
    <p>${message}</p>
  </div>
</body>
</html>`;

  return new Response(html, {
    status,
    headers: {'Content-Type': 'text/html; charset=utf-8'},
  });
}

async function saveInstallation(tokenData: SlackOAuthResponse) {
  return supabaseServer.from('slack_installations').upsert(
    {
      team_id: tokenData.team!.id,
      team_name: tokenData.team!.name,
      bot_user_id: tokenData.bot_user_id ?? null,
      access_token: tokenData.access_token,
      scope: tokenData.scope ?? null,
    },
    {onConflict: 'team_id'}
  );
}

async function exchangeCodeForToken(code: string, redirectUri: string) {
  const res = await fetch('https://slack.com/api/oauth.v2.access', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: new URLSearchParams({
      client_id: SLACK_CLIENT_ID,
      client_secret: SLACK_CLIENT_SECRET,
      code,
      redirect_uri: redirectUri,
    }),
  });
  return (await res.json()) as SlackOAuthResponse;
}

/**
 * Slack OAuth 콜백.
 * Slack 인증 후 authorization code를 받아 access token으로 교환하고
 * 워크스페이스 설치 정보를 DB에 저장합니다.
 */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const error = req.nextUrl.searchParams.get('error');

  if (error) {
    return htmlResponse(false, `설치가 취소되었습니다: ${error}`);
  }

  if (!code) {
    return htmlResponse(false, 'authorization code가 없습니다.', 400);
  }

  if (!SLACK_CLIENT_ID || !SLACK_CLIENT_SECRET) {
    return htmlResponse(false, '서버 설정 오류: Slack credentials가 설정되지 않았습니다.', 500);
  }

  const redirectUri = `${req.nextUrl.origin}/api/slack/oauth/callback`;
  const tokenData = await exchangeCodeForToken(code, redirectUri);

  if (!tokenData.ok || !tokenData.team) {
    return htmlResponse(false, `Slack 인증 실패: ${tokenData.error ?? 'unknown error'}`);
  }

  const {error: dbError} = await saveInstallation(tokenData);

  if (dbError) {
    return htmlResponse(false, '설치 정보 저장 중 오류가 발생했습니다.', 500);
  }

  return htmlResponse(
    true,
    `${tokenData.team.name} 워크스페이스에 설치가 완료되었습니다!`
  );
}
