import {NextRequest, NextResponse} from 'next/server';

const SLACK_CLIENT_ID = process.env.SLACK_CLIENT_ID ?? '';

/**
 * Slack OAuth 설치 시작점.
 * "Add to Slack" 버튼이 이 URL로 연결됩니다.
 * Slack의 OAuth 인증 페이지로 리다이렉트합니다.
 */
export async function GET(req: NextRequest) {
  if (!SLACK_CLIENT_ID) {
    return NextResponse.json(
      {error: 'SLACK_CLIENT_ID가 설정되지 않았습니다.'},
      {status: 500}
    );
  }

  const origin = req.nextUrl.origin;
  const redirectUri = `${origin}/api/slack/oauth/callback`;

  const slackAuthorizeUrl = new URL('https://slack.com/oauth/v2/authorize');
  slackAuthorizeUrl.searchParams.set('client_id', SLACK_CLIENT_ID);
  slackAuthorizeUrl.searchParams.set('scope', 'commands');
  slackAuthorizeUrl.searchParams.set('redirect_uri', redirectUri);

  return NextResponse.redirect(slackAuthorizeUrl.toString());
}
