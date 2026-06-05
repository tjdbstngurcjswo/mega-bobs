'use client';

import {useEffect} from 'react';

import {useMenuStore} from '@/store/useMenuStore';
import {MenuType} from '@/types/menu';

const MenuStoreHydrator = ({menus}: {menus: MenuType[]}) => {
  const setMenus = useMenuStore((s) => s.setMenus);

  useEffect(() => {
    setMenus(menus);
  }, [menus, setMenus]);

  return null;
};

export default MenuStoreHydrator;
