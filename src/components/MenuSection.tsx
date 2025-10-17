import {MenuItemType} from '@/types/MenuType';

import MenuItem from './MenuItem';

interface MenuSectionProps {
  items?: MenuItemType[];
  isLoading?: boolean;
}

const MenuSection = ({items, isLoading}: MenuSectionProps) => {
  const totalCalories = items?.reduce((sum, item) => sum + item.kcal, 0) ?? 0;

  if (isLoading) return <SectionSkeleton />;
  if (!items || items.length === 0) return <SectionEmpty />;

  return (
    <Section>
      <ItemContainer>
        {items.map((item) => (
          <MenuItem key={item.name} item={item} />
        ))}
      </ItemContainer>
      <Divider />
      <TotalCalories totalCalories={totalCalories} />
    </Section>
  );
};

const Section = ({children}: {children: React.ReactNode}) => (
  <div className="min-h-0 flex-1 overflow-auto">
    <div className="flex h-full flex-col rounded-xl bg-white shadow-lg dark:bg-[#23242B] dark:shadow-none">
      {children}
    </div>
  </div>
);

const Divider = () => (
  <div className="my-3 border-t border-dashed border-slate-400"></div>
);

const ItemContainer = ({children}: {children: React.ReactNode}) => (
  <div className="flex-1 space-y-4 overflow-y-auto px-1 py-2">{children}</div>
);

const SectionSkeleton = () => (
  <div className="flex flex-1 items-center justify-center">
    <div className="text-center">
      <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-slate-300 border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
      <p className="text-sm text-gray-500">메뉴를 불러오는 중...</p>
    </div>
  </div>
);

const SectionEmpty = () => (
  <div className="flex flex-1 items-center justify-center">
    <div className="text-center">
      <div className="mb-3 text-2xl">📋</div>
      <div className="text-sm font-medium text-gray-600 sm:text-base">
        선택한 날짜에 메뉴 데이터가 없습니다
      </div>
      <div className="mt-2 text-xs text-gray-400 sm:text-sm">
        다른 날짜를 선택해보세요
      </div>
    </div>
  </div>
);

const TotalCalories = ({totalCalories}: {totalCalories: number}) => (
  <div className="rounded-lg border border-slate-200 bg-gray-50 p-4 shadow-sm transition-all hover:shadow-md sm:p-5 dark:border-slate-700 dark:bg-[#181A20] dark:shadow-none">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-medium text-slate-800 sm:text-base dark:text-white">
        총 칼로리
      </h3>
      <div className="ml-2 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 sm:ml-4 sm:px-3 sm:text-sm dark:bg-blue-900 dark:text-blue-200">
        {totalCalories} kcal
      </div>
    </div>
  </div>
);

export default MenuSection;
