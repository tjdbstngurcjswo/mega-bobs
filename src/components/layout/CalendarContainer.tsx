const CalendarContainer = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="flex flex-col items-center gap-3 bg-gradient-to-r from-slate-800 to-slate-900 p-3 text-white sm:gap-4">
      {children}
    </div>
  );
};

export default CalendarContainer;
