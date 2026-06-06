'use client';

import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

const ErrorFallback = ({error}: {error: Error}) => (
  <div className="flex min-h-[300px] flex-col items-center justify-center px-6 py-12 text-center">
    <p className="text-[13px] font-black tracking-[0.3em] text-accent-text">ERROR</p>
    <h2 className="mt-3 text-[17px] font-extrabold">문제가 발생했어요</h2>
    <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">잠시 후 새로고침해 주세요.</p>
    <button
      type="button"
      onClick={() => window.location.reload()}
      className="mt-5 border border-line px-4 py-2 text-sm font-bold text-ink hover:bg-surface"
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

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {hasError: false, error: null};
  }

  static getDerivedStateFromError(error: Error) {
    return {hasError: true, error};
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return this.props.fallback ?? <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
