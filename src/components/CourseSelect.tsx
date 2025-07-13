interface CourseSelectProps {
  selectedCourse: '1' | '2' | 'take-out'; // TODO: yoonp - course 타입 정의 필요
  onChange: (course: '1' | '2' | 'take-out') => void;
}

const CourseSelect = ({selectedCourse, onChange}: CourseSelectProps) => {
  const getIndicatorPosition = () => {
    switch (selectedCourse) {
      case '1':
        return 'translate-x-0';
      case '2':
        return 'translate-x-full';
      case 'take-out':
        return 'translate-x-[200%]';
      default:
        return 'translate-x-0';
    }
  };

  return (
    <div className="px-4 py-2">
      <div className="relative flex rounded-full bg-gray-100 p-1">
        <div
          className={`absolute top-1 bottom-1 left-1 w-1/3 rounded-full bg-slate-800 transition-transform duration-300 ease-in-out ${getIndicatorPosition()}`}
        />

        {/* 버튼들 */}
        <button
          onClick={() => onChange('1')}
          className={`relative z-10 flex-1 py-2 text-center text-sm font-medium transition-colors duration-300 ${
            selectedCourse === '1' ? 'text-white' : 'text-gray-700'
          }`}
        >
          코스1
        </button>
        <button
          onClick={() => onChange('2')}
          className={`relative z-10 flex-1 py-2 text-center text-sm font-medium transition-colors duration-300 ${
            selectedCourse === '2' ? 'text-white' : 'text-gray-700'
          }`}
        >
          코스2
        </button>
        <button
          onClick={() => onChange('take-out')}
          className={`relative z-10 flex-1 py-2 text-center text-sm font-medium transition-colors duration-300 ${
            selectedCourse === 'take-out' ? 'text-white' : 'text-gray-700'
          }`}
        >
          Takeout
        </button>
      </div>
    </div>
  );
};

export default CourseSelect;
