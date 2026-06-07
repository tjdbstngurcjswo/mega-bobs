const ErrorFallback = ({ error }: { error: Error }) => (
  <div className="flex min-h-[300px] flex-col items-center justify-center px-6 py-12 text-center">
    <p className="text-accent-text text-[13px] font-black tracking-[0.3em]">
      ERROR
    </p>
    <h2 className="mt-3 text-[17px] font-extrabold">문제가 발생했어요</h2>
    <p className="text-muted mt-1.5 text-[13.5px] leading-relaxed">
      잠시 후 새로고침해 주세요.
    </p>
    <button
      type="button"
      onClick={() => window.location.reload()}
      className="border-line text-ink hover:bg-surface mt-5 border px-4 py-2 text-sm font-bold"
    >
      새로고침
    </button>
    {process.env.NODE_ENV === 'development' && (
      <pre className="mt-4 max-w-md overflow-auto rounded bg-red-50 p-2 text-left text-xs text-red-700">
        {error.stack}
      </pre>
    )}
  </div>
);

export default ErrorFallback;
