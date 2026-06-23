'use client';

import { Clock } from 'lucide-react';

import MenuBoardShareButton from '@/components/menu/MenuBoard/_MenuBoardShareButton';
import {
  menuHeaderClass,
  menuHeaderIconClass,
  menuHeadingTitleClass,
  menuSubheadingClass,
} from '@/components/menu/MenuBoard/MenuBoard.styles';
import { CAFETERIA_LABEL } from '@/constants/cafeteria';

import { MenuBoardHeaderProps } from './MenuBoardHeader.types';

const MenuBoardHeader = ({ date }: MenuBoardHeaderProps) => {
  return (
    <div className={menuHeaderClass}>
      <h2 className={menuHeadingTitleClass}>메가존 구내식당</h2>
      <p className={menuSubheadingClass}>
        <Clock
          size={9}
          strokeWidth={2.5}
          className={menuHeaderIconClass}
          aria-hidden
        />
        <span>{CAFETERIA_LABEL}</span>
      </p>
      <MenuBoardShareButton date={date} />
    </div>
  );
};

export default MenuBoardHeader;
