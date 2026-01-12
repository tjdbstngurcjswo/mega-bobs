'use client';

import {MenuCategoryLabel} from '@/constants/menu';
import {MenuCategory} from '@/types/menu';
interface CourseSelectProps {
  category: MenuCategory;
  onChange: (category: MenuCategory) => void;
}

const CourseSelect = ({category, onChange}: CourseSelectProps) => {
  const getIndicatorPosition = () => {
    switch (category) {
      case 'COURSE_1':
        return 'translate-x-0';
      case 'COURSE_2':
        return 'translate-x-full';
      case 'TAKE_OUT':
        return 'translate-x-[200%]';
      default:
        return 'translate-x-0';
    }
  };

  return (
    <div className="relative flex rounded-xl bg-slate-200 p-1 dark:bg-[#23242B]">
      <div
        className={`absolute top-1 bottom-1 left-0 w-1/3 scale-95 rounded-lg bg-slate-900 transition-all duration-300 ease-in-out ${getIndicatorPosition()}`}
      />
      <button
        onClick={() => onChange('COURSE_1')}
        className={`relative z-10 flex-1 py-2 text-center text-xs font-semibold transition-all duration-300 sm:py-2.5 sm:text-sm ${
          category === 'COURSE_1'
            ? 'text-white dark:text-white'
            : 'text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white'
        }`}
      >
        {MenuCategoryLabel.COURSE_1.ko}
      </button>
      <button
        onClick={() => onChange('COURSE_2')}
        className={`relative z-10 flex-1 py-2 text-center text-xs font-semibold transition-all duration-300 sm:py-2.5 sm:text-sm ${
          category === 'COURSE_2'
            ? 'text-white dark:text-white'
            : 'text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white'
        }`}
      >
        {MenuCategoryLabel.COURSE_2.ko}
      </button>
      <button
        onClick={() => onChange('TAKE_OUT')}
        className={`relative z-10 flex-1 py-2 text-center text-xs font-semibold transition-all duration-300 sm:py-2.5 sm:text-sm ${
          category === 'TAKE_OUT'
            ? 'text-white dark:text-white'
            : 'text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white'
        }`}
      >
        {MenuCategoryLabel.TAKE_OUT.ko}
      </button>
    </div>
  );
};

export default CourseSelect;
