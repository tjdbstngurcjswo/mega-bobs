import {menuCategoryLabelMap} from '@/constants/menuCategory';
import {CategoryEnum} from '@/types/MenuType';

interface CourseSelectProps {
  selectedCourse: CategoryEnum;
  onChange: (course: CategoryEnum) => void;
}

const CourseSelect = ({selectedCourse, onChange}: CourseSelectProps) => {
  const getIndicatorPosition = () => {
    switch (selectedCourse) {
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
    <div className="relative flex rounded-xl bg-slate-100 p-1">
      <div
        className={`absolute top-1 bottom-1 left-1 w-1/3 rounded-lg bg-gradient-to-r from-slate-800 to-slate-900 shadow-sm transition-all duration-300 ease-in-out ${getIndicatorPosition()}`}
      />
      <button
        onClick={() => onChange('COURSE_1')}
        className={`relative z-10 flex-1 py-2 text-center text-xs font-semibold transition-all duration-300 sm:py-2.5 sm:text-sm ${
          selectedCourse === 'COURSE_1'
            ? 'text-white'
            : 'text-slate-600 hover:text-slate-800'
        }`}
      >
        {menuCategoryLabelMap.COURSE_1.ko}
      </button>
      <button
        onClick={() => onChange('COURSE_2')}
        className={`relative z-10 flex-1 py-2 text-center text-xs font-semibold transition-all duration-300 sm:py-2.5 sm:text-sm ${
          selectedCourse === 'COURSE_2'
            ? 'text-white'
            : 'text-slate-600 hover:text-slate-800'
        }`}
      >
        {menuCategoryLabelMap.COURSE_2.ko}
      </button>
      <button
        onClick={() => onChange('TAKE_OUT')}
        className={`relative z-10 flex-1 py-2 text-center text-xs font-semibold transition-all duration-300 sm:py-2.5 sm:text-sm ${
          selectedCourse === 'TAKE_OUT'
            ? 'text-white'
            : 'text-slate-600 hover:text-slate-800'
        }`}
      >
        {menuCategoryLabelMap.TAKE_OUT.ko}
      </button>
    </div>
  );
};

export default CourseSelect;
