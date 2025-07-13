interface DaySelectProps {
  currentDate: Date;
  onChange: (date: Date) => void;
}

const DaySelect = ({currentDate, onChange}: DaySelectProps) => {
  // 매주 월요일 기준 7일치 날짜 배열 생성
  const days = Array.from({length: 7}, (_, i) => {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() + i);
    return date;
  });

  const isSelected = (date: Date) => {
    return date.toISOString() === currentDate.toISOString();
  };

  return (
    <div className="mt-lg flex items-center justify-center gap-[4px]">
      {days.map((day) => (
        <button
          key={day.toISOString()}
          onClick={() => onChange(day)}
          className={`rounded-base flex h-[30px] w-[68px] flex-col items-center justify-center ${
            isSelected(day)
              ? 'bg-white shadow-[0px_2px_4px_rgba(0,0,0,0.1)]'
              : 'bg-white/10'
          }`}
        >
          <span
            className={`text-sm font-medium ${
              isSelected(day)
                ? 'text-primary opacity-80'
                : 'text-white opacity-80'
            }`}
          >
            {day.toLocaleDateString('ko-KR', {weekday: 'short'})}
          </span>
          <span
            className={`text-base ${isSelected(day) ? 'text-primary' : 'text-white'}`}
          >
            {day.toLocaleDateString('ko-KR', {day: 'numeric'})}
          </span>
        </button>
      ))}
    </div>
  );
};

export default DaySelect;
