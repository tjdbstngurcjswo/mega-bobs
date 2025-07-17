const Loading = () => {
  return (
    <div className="flex h-[85vh] w-full max-w-md items-center justify-center rounded-3xl bg-white shadow-2xl sm:max-w-lg md:max-w-xl lg:max-w-2xl dark:bg-[#23242B] dark:shadow-none">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800 dark:border-slate-700 dark:border-t-slate-200"></div>
        <div className="text-center">
          <p className="text-base font-medium text-slate-800 dark:text-white">
            MegaBobs
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            메뉴를 불러오는 중...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loading;
