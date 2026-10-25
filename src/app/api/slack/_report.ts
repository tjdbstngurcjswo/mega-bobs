import { trackServerEvent } from '@/lib/beacon/collect';

export type SlackCommandReport = {
  track: boolean;
  keyword: string;
  date: string;
  cacheHit: boolean;
  durationMs: number;
};

export const reportSlackCommand = async (input: SlackCommandReport) => {
  if (!input.track) return;

  await trackServerEvent(
    'slack_bot_call',
    {
      keyword: input.keyword,
      date: input.date,
      cache_hit: input.cacheHit,
      duration_ms: input.durationMs,
    },
    '/api/slack'
  );
};
