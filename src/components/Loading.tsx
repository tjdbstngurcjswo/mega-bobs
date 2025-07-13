const Loading = () => {
  return (
    <div className="flex h-[85vh] w-full max-w-md items-center justify-center rounded-3xl bg-white shadow-2xl sm:max-w-lg md:max-w-xl lg:max-w-2xl">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-slate-800"></div>
        <div className="text-center">
          <p className="text-base font-medium text-gray-700">MegaBobs</p>
          <p className="text-sm text-gray-500">메뉴를 불러오는 중...</p>
        </div>
      </div>
    </div>
  );
};

export default Loading;
