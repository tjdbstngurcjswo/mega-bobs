import {render, screen} from '@testing-library/react';
import {describe, expect, test} from 'vitest';

import BoardEmpty from '@/components/board/BoardEmpty';

describe('BoardEmpty', () => {
  test('CLOSED — 메뉴 없는 날 안내', () => {
    render(<BoardEmpty variant="closed" />);
    expect(screen.getByText('CLOSED')).toBeInTheDocument();
    expect(screen.getByText('오늘은 구내식당이 쉬는 날이에요')).toBeInTheDocument();
  });

  test('COMING UP — 다음 주 미공개 안내', () => {
    render(<BoardEmpty variant="comingUp" />);
    expect(screen.getByText('COMING UP')).toBeInTheDocument();
    expect(screen.getByText('다음 주 메뉴는 목요일에 공개돼요')).toBeInTheDocument();
  });
});
