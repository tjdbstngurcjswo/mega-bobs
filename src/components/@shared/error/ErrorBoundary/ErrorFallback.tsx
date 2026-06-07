import {
  errorBodyClass,
  errorCodeClass,
  errorContainerClass,
  errorPreClass,
  errorTitleClass,
  reloadButtonClass,
} from './ErrorFallback.styles';

const ErrorFallback = ({ error }: { error: Error }) => (
  <div className={errorContainerClass}>
    <p className={errorCodeClass}>ERROR</p>
    <h2 className={errorTitleClass}>문제가 발생했어요</h2>
    <p className={errorBodyClass}>잠시 후 새로고침해 주세요</p>
    <button
      type="button"
      onClick={() => window.location.reload()}
      className={reloadButtonClass}
    >
      새로고침
    </button>
    {process.env.NODE_ENV === 'development' && (
      <pre className={errorPreClass}>{error.stack}</pre>
    )}
  </div>
);

export default ErrorFallback;
