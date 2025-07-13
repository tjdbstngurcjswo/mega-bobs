import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  notFoundFallback?: React.ReactNode;
  unauthorizedFallback?: React.ReactNode;
  forbiddenFallback?: React.ReactNode;
  serverErrorFallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {hasError: false, error: null};
  }

  static getDerivedStateFromError(error: Error) {
    return {hasError: true, error};
  }

  render() {
    const {hasError, error} = this.state;
    const {
      notFoundFallback,
      unauthorizedFallback,
      forbiddenFallback,
      serverErrorFallback,
      errorFallback,
      children,
    } = this.props;

    if (hasError && error) {
      const msg = error.message?.toLowerCase() || '';
      if (msg.includes('not found') || msg.includes('404')) {
        return notFoundFallback || <div>데이터가 없습니다.</div>;
      }
      if (msg.includes('unauthorized') || msg.includes('401')) {
        return unauthorizedFallback || <div>로그인이 필요합니다.</div>;
      }
      if (msg.includes('forbidden') || msg.includes('403')) {
        return forbiddenFallback || <div>접근 권한이 없습니다.</div>;
      }
      if (msg.includes('server') || msg.includes('500') || msg.includes('503')) {
        return serverErrorFallback || <div>서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.</div>;
      }
      return errorFallback || <div>알 수 없는 에러가 발생했습니다.</div>;
    }

    return children;
  }
} 