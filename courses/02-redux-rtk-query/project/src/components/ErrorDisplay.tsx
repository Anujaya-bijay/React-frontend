import React from 'react';

interface ErrorDisplayProps {
  error: unknown;
  onRetry?: () => void;
}

function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') return error;

  if (error && typeof error === 'object') {
    // RTK Query FetchBaseQueryError / SerializedError shapes
    if ('status' in error && 'data' in error) {
      const data = (error as { data?: unknown }).data;
      if (typeof data === 'string') return data;
      if (data && typeof data === 'object' && 'message' in data) {
        return String((data as { message?: unknown }).message);
      }
      return `Request failed with status ${(error as { status?: unknown }).status}`;
    }
    if ('message' in error && typeof (error as { message?: unknown }).message === 'string') {
      return (error as { message: string }).message;
    }
  }

  return 'Something went wrong. Please try again.';
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry }) => {
  return (
    <div data-testid="error-display" role="alert">
      <p>{getErrorMessage(error)}</p>
      {onRetry && (
        <button type="button" data-testid="retry-btn" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;