import 'server-only';

import {supabaseServer} from '@/lib/supabase-server';
import {MenuType} from '@/types/MenuType';

const getWeeklyMenu = async (args: {start: string; end: string}) => {
  const {data, error} = await supabaseServer
    .from('daily_menu')
    .select('*')
    .gte('date', args.start)
    .lte('date', args.end);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) satisfies MenuType[];
};

export default getWeeklyMenu;
