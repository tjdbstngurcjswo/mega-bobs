import {render, screen} from '@testing-library/react';
import {describe, expect, test} from 'vitest';

import MenuBoard from '@/components/board/MenuBoard';
import dayjs from '@/lib/dayjs';
import {formatYYYYMMDD} from '@/lib/utils';
import {MenuType} from '@/types/menu';

const today = formatYYYYMMDD(dayjs().tz());

const menu: MenuType = {
  category: 'COURSE_1',
  date: today,
  meal: 'LUNCH' as MenuType['meal'],
  items: [{name: '제육볶음', kcal: 350}],
};

describe('MenuBoard', () => {
  test('menus prop으로 선택일 코스를 즉시 렌더한다 (스토어 미경유 → 하이드레이션 시프트 없음)', () => {
    render(<MenuBoard menus={[menu]} />);
    expect(screen.getByText('코스1')).toBeInTheDocument();
    expect(screen.getByText('제육볶음')).toBeInTheDocument();
  });

  test('해당일 메뉴가 없으면 빈 상태(CLOSED)를 렌더한다', () => {
    render(<MenuBoard menus={[]} />);
    expect(screen.getByText('CLOSED')).toBeInTheDocument();
  });
});
