import 'server-only';

import {supabaseServer} from '@/lib/supabaseServer';
import {MenuType} from '@/models/menu';

/**
 * Supabase `daily_menu` 테이블에서 날짜 범위에 해당하는 메뉴를 조회한다.
 * @param args.start - 조회 시작일 (YYYY-MM-DD)
 * @param args.end   - 조회 종료일 (YYYY-MM-DD)
 */
const getMenu = async (args: {start: string; end: string}) => {
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

export default getMenu;
