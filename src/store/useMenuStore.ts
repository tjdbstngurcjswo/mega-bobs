import {create} from 'zustand';

import {DEFAULT_MENU_CATEGORY} from '@/constants/menu';
import {MenuCategory, MenuType} from '@/types/menu';

interface MenuStore {
  menus: MenuType[];
  // category/setCategory: 플랜 ②(투표) menu_id 재사용 예정 — 현재 미사용이나 유지
  category: MenuCategory;
  setMenus: (menus: MenuType[]) => void;
  setCategory: (category: MenuCategory) => void;
}

export const useMenuStore = create<MenuStore>((set) => ({
  menus: [],
  category: DEFAULT_MENU_CATEGORY,

  setMenus: (menus) => set({menus}),
  setCategory: (category) => set({category}),
}));
