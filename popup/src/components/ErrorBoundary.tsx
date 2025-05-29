import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import ErrorView from './steps/error-view'; // Assuming ErrorView is in steps

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error in ErrorBoundary:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <ErrorView error={this.state.error?.message || 'An unexpected error occurred.'} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
