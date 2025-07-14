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

const DefaultErrorFallback = ({error}: {error: Error}) => {
  const handleEmailClick = (email: string) => {
    const subject = encodeURIComponent('[MegaBobs] 앱 오류 발생');
    const body = encodeURIComponent(`안녕하세요,

MegaBobs 앱에서 다음과 같은 오류가 발생했습니다:

오류 메시지: ${error.message}
발생 시간: ${new Date().toLocaleString('ko-KR')}
브라우저: ${navigator.userAgent}

문제를 해결해 주시기 바랍니다.

감사합니다.`);

    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center bg-white p-6 text-center">
      <div className="mb-6 text-6xl">⚠️</div>
      <h2 className="mb-4 text-xl font-bold text-slate-800">
        알 수 없는 오류가 발생했습니다
      </h2>
      <p className="mb-6 text-sm text-slate-600">
        죄송합니다. 예상치 못한 문제가 발생했습니다.
        <br />
        아래 이메일로 문의해 주시면 빠르게 해결해 드리겠습니다.
      </p>

      <div className="mb-4 rounded-lg bg-slate-50 p-4">
        <h3 className="mb-2 text-sm font-semibold text-slate-700">
          문의 연락처
        </h3>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => handleEmailClick('yoonp@mz.co.kr')}
            className="block rounded-md bg-slate-500 px-4 py-2 text-left text-sm font-medium text-white transition-colors hover:bg-slate-600"
          >
            박서윤 📧 yoonp@mz.co.kr
          </button>
          <button
            onClick={() => handleEmailClick('tngur1120@mz.co.kr')}
            className="block rounded-md bg-slate-500 px-4 py-2 text-left text-sm font-medium text-white transition-colors hover:bg-slate-600"
          >
            홍수혁 📧 tngur1120@mz.co.kr
          </button>
        </div>
      </div>

      <button
        onClick={() => window.location.reload()}
        className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-300"
      >
        🔄 페이지 새로고침
      </button>

      {process.env.NODE_ENV === 'development' && (
        <details className="mt-4 w-full max-w-md">
          <summary className="cursor-pointer text-xs text-slate-500 hover:text-slate-700">
            개발자 정보 (클릭하여 펼치기)
          </summary>
          <pre className="mt-2 overflow-auto rounded bg-red-50 p-2 text-left text-xs text-red-700">
            {error.stack}
          </pre>
        </details>
      )}
    </div>
  );
};

class ErrorBoundary extends React.Component<
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

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 에러 로깅 (필요시 외부 서비스로 전송)
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const msg = this.state.error.message?.toLowerCase() || '';

      if (msg.includes('404'))
        return (
          this.props.notFoundFallback || (
            <div className="flex min-h-[300px] flex-col items-center justify-center bg-white p-6 text-center">
              <div className="mb-4 text-4xl">📋</div>
              <h2 className="mb-2 text-lg font-bold text-gray-800">
                데이터가 없습니다
              </h2>
              <p className="text-sm text-gray-600">
                요청하신 데이터를 찾을 수 없습니다.
              </p>
            </div>
          )
        );

      if (msg.includes('500') || msg.includes('503'))
        return (
          this.props.serverErrorFallback || (
            <div className="flex min-h-[300px] flex-col items-center justify-center bg-white p-6 text-center">
              <div className="mb-4 text-4xl">🔧</div>
              <h2 className="mb-2 text-lg font-bold text-gray-800">
                서버 오류
              </h2>
              <p className="text-sm text-gray-600">
                서버에 일시적인 문제가 발생했습니다.
                <br />
                잠시 후 다시 시도해 주세요.
              </p>
            </div>
          )
        );

      return (
        this.props.errorFallback || (
          <DefaultErrorFallback error={this.state.error} />
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
