import 'server-only';

import { supabaseServer } from '@/lib/supabaseServer';
import { SlackCommandEvent } from '@/models/slackCommand';

type TrackSlackCommandInput = {
  keyword: string;
  date: string;
  cacheHit: boolean;
  cachedAt: number;
  durationMs: number;
};

const trackSlackCommand = async (input: TrackSlackCommandInput) => {
  const event: SlackCommandEvent = {
    keyword: input.keyword,
    menuDate: input.date,
    cacheHit: input.cacheHit,
    cachedAt: new Date(input.cachedAt).toISOString(),
    durationMs: input.durationMs,
  };

  const { error, status } = await supabaseServer
    .from('slack_command_events')
    .insert({
      keyword: event.keyword,
      menu_date: event.menuDate,
      cache_hit: event.cacheHit,
      cached_at: event.cachedAt,
      duration_ms: event.durationMs,
    });

  if (error) {
    console.error(
      '[slack] usage log failed:',
      status,
      error.message || `status ${status}`
    );
  }
};

export default trackSlackCommand;
