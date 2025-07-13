/* eslint-disable complexity */
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

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {hasError: false, error: null};
  }

  static getDerivedStateFromError(error: Error) {
    return {hasError: true, error};
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const msg = this.state.error.message?.toLowerCase() || '';
      if (msg.includes('404'))
        return this.props.notFoundFallback || <div>데이터가 없습니다.</div>;

      if (msg.includes('500') || msg.includes('503'))
        return (
          this.props.serverErrorFallback || (
            <div>서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.</div>
          )
        );

      return (
        this.props.errorFallback || <div>알 수 없는 에러가 발생했습니다.</div>
      );
    }

    return this.props.children;
  }
}
