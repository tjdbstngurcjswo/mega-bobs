import {render, screen} from '@testing-library/react';
import {describe, expect, test} from 'vitest';

import CourseRow from '@/components/board/CourseRow';
import {MenuType} from '@/types/menu';

const menu: MenuType = {
  category: 'COURSE_1',
  date: '2026-06-05',
  meal: 'LUNCH' as MenuType['meal'],
  items: [
    {name: '제육볶음', kcal: 350},
    {name: '백미밥', kcal: 270},
  ],
};

describe('CourseRow', () => {
  test('코스 라벨과 합계 kcal을 표시한다', () => {
    render(<CourseRow menu={menu} />);
    expect(screen.getByText('코스1')).toBeInTheDocument();
    expect(screen.getByText('620 kcal')).toBeInTheDocument();
  });

  test('모든 메뉴를 동등하게 나열하고 메뉴별 kcal 단위를 병기한다', () => {
    render(<CourseRow menu={menu} />);
    expect(screen.getByText('제육볶음')).toBeInTheDocument();
    expect(screen.getByText('350kcal')).toBeInTheDocument();
    expect(screen.getByText('270kcal')).toBeInTheDocument();
  });

  test('kcal이 0인 메뉴는 숫자를 생략한다 (레이아웃 유지)', () => {
    render(
      <CourseRow
        menu={{...menu, items: [{name: '피클', kcal: 0}]}}
      />
    );
    expect(screen.getByText('피클')).toBeInTheDocument();
    expect(screen.queryByText('0kcal')).not.toBeInTheDocument();
  });
});
