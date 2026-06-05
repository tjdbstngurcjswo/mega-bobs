import {create} from 'zustand';

import {DEFAULT_MENU_CATEGORY} from '@/constants/menu';
import {MenuCategory} from '@/types/menu';

// 메뉴 목록은 서버 페치 → MenuBoard prop으로 전달(스토어 미경유)해 하이드레이션 시프트를 방지한다.
// category/setCategory: 플랜 ②(투표) menu_id 재사용 예정 — 현재 미사용이나 유지
interface MenuStore {
  category: MenuCategory;
  setCategory: (category: MenuCategory) => void;
}

export const useMenuStore = create<MenuStore>((set) => ({
  category: DEFAULT_MENU_CATEGORY,
  setCategory: (category) => set({category}),
}));
