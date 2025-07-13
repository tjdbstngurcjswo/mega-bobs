interface MainWidgetProps {
  children: React.ReactNode;
}

const MainWidget = ({children}: MainWidgetProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-slate-800 shadow-2xl">
        <div className="bg-slate-800 px-6 py-4">
          <div className="flex items-center justify-center">
            <h1 className="text-xl text-white">MegaBobs</h1>
          </div>
        </div>
        <div className="bg-slate-800">{children}</div>
      </div>
    </div>
  );
};

export default MainWidget;
