'use client';

import React, { Component, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Error Boundary Component
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the app.
 *
 * Usage:
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details to console (in production, you'd send to error reporting service)
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // TODO: Send to error reporting service (e.g., Sentry, LogRocket)
    // Example:
    // Sentry.captureException(error, { extra: errorInfo });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-950 p-6">
          <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-500">
              <AlertCircle className="h-8 w-8" />
              <h2 className="text-xl font-semibold">Something went wrong</h2>
            </div>

            <p className="text-gray-400 text-sm">
              We encountered an unexpected error. This has been logged and we'll look into it.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 p-3 bg-gray-950 rounded border border-gray-800">
                <summary className="cursor-pointer text-sm font-medium text-gray-300 mb-2">
                  Error Details (Development Only)
                </summary>
                <div className="text-xs font-mono text-red-400 space-y-2">
                  <div>
                    <strong className="text-gray-400">Error:</strong>
                    <pre className="mt-1 whitespace-pre-wrap break-words">
                      {this.state.error.toString()}
                    </pre>
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong className="text-gray-400">Component Stack:</strong>
                      <pre className="mt-1 whitespace-pre-wrap break-words text-gray-500">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Simple Error Fallback Component
 *
 * A reusable fallback UI for smaller error boundaries
 */
export function SimpleErrorFallback({
  error,
  resetError
}: {
  error: Error;
  resetError: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-900 border border-gray-800 rounded-lg">
      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-gray-100 mb-2">
        Component Error
      </h3>
      <p className="text-sm text-gray-400 text-center mb-4">
        This section couldn't load properly.
      </p>
      <button
        onClick={resetError}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
      >
        Retry
      </button>
    </div>
  );
}
