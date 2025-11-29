/**
 * Error Boundary Component
 */

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';
import './ErrorBoundary.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary">
          <div className="error-boundary-icon">
            <FiAlertTriangle />
          </div>
          <h2 className="error-boundary-title">Something went wrong</h2>
          <p className="error-boundary-message">
            An unexpected error occurred. Please try again.
          </p>
          {this.state.error && (
            <pre className="error-boundary-details">
              {this.state.error.message}
            </pre>
          )}
          <button className="error-boundary-button" onClick={this.handleRetry}>
            <FiRefreshCw />
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
