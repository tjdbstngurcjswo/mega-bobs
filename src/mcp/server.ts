import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import {z} from 'zod';

import {supabaseServer} from '../lib/supabase-server';

dayjs.extend(utc);
dayjs.extend(timezone);

const SEOUL_TIMEZONE = 'Asia/Seoul';

dayjs.tz.setDefault(SEOUL_TIMEZONE);

const DAY_OFFSET_MAP: Record<string, number> = {
  오늘: 0,
  내일: 1,
  모레: 2,
  글피: 3,
};

const CATEGORY_LABELS: Record<string, string> = {
  COURSE_1: '코스1',
  COURSE_2: '코스2',
  TAKE_OUT: '테이크아웃',
};

const MEAL_LABELS: Record<string, string> = {
  BREAKFAST: '조식',
  LUNCH: '중식',
  DINNER: '석식',
};

type MenuItemType = {name: string; kcal: number};

type MenuType = {
  category: string;
  date: string;
  items: MenuItemType[];
  meal: string;
};

const getMenu = async (start: string, end: string): Promise<MenuType[]> => {
  const {data, error} = await supabaseServer
    .from('daily_menu')
    .select('*')
    .gte('date', start)
    .lte('date', end);

  if (error) throw new Error(error.message);

  return data ?? [];
};

const formatMenu = (menus: MenuType[]): string => {
  if (menus.length === 0) return '해당 날짜의 메뉴가 없습니다.';

  const grouped = menus.reduce<Record<string, MenuType[]>>((acc, menu) => {
    if (!acc[menu.date]) acc[menu.date] = [];
    acc[menu.date].push(menu);
    return acc;
  }, {});

  return Object.entries(grouped)
    .map(([date, dateMenus]) => {
      const header = `📅 ${date}`;
      const sections = dateMenus
        .map((menu) => {
          const categoryLabel = CATEGORY_LABELS[menu.category] ?? menu.category;
          const mealLabel = MEAL_LABELS[menu.meal] ?? menu.meal;
          const items = menu.items
            .map(
              (item) =>
                `  - ${item.name}${item.kcal ? ` (${item.kcal}kcal)` : ''}`
            )
            .join('\n');

          return `\n🍽️ ${categoryLabel} (${mealLabel})\n${items}`;
        })
        .join('\n');

      return `${header}${sections}`;
    })
    .join('\n\n');
};

const createMcpServer = () => {
  const server = new McpServer({
    name: 'mega-bobs',
    version: '1.0.0',
  });

  server.tool(
    'get_menu',
    '메가존 구내식당 메뉴를 조회합니다. 날짜(YYYY-MM-DD) 또는 한국어 키워드(오늘/내일/모레/글피)로 조회할 수 있습니다.',
    {
      query: z
        .string()
        .optional()
        .describe(
          '날짜(YYYY-MM-DD) 또는 키워드(오늘/내일/모레/글피). 미입력시 오늘 메뉴를 조회합니다.'
        ),
      end_date: z
        .string()
        .optional()
        .describe('종료 날짜(YYYY-MM-DD). 날짜 범위 조회시 사용합니다.'),
      category: z
        .enum(['COURSE_1', 'COURSE_2', 'TAKE_OUT'])
        .optional()
        .describe(
          '메뉴 카테고리 필터. COURSE_1(코스1), COURSE_2(코스2), TAKE_OUT(테이크아웃)'
        ),
    },
    async ({query, end_date, category}) => {
      try {
        let startDate: string;
        let endDate: string;

        if (!query || query in DAY_OFFSET_MAP) {
          const offset = DAY_OFFSET_MAP[query ?? '오늘'] ?? 0;
          const date = dayjs()
            .tz(SEOUL_TIMEZONE)
            .add(offset, 'day')
            .format('YYYY-MM-DD');
          startDate = date;
          endDate = end_date ?? date;
        } else {
          startDate = query;
          endDate = end_date ?? query;
        }

        let menus = await getMenu(startDate, endDate);

        if (category) {
          menus = menus.filter((m) => m.category === category);
        }

        return {
          content: [{type: 'text' as const, text: formatMenu(menus)}],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  return server;
};

export default createMcpServer;
