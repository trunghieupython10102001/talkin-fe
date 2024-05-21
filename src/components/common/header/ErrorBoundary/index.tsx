import React from 'react';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }> {
  static getDerivedStateFromError(error: any) {
    console.log('Error encounter: ', error);

    // Update state so the next render will show the fallback UI.
    return {};
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    console.log('componentDidCatch', error, errorInfo);
  }

  render() {
    return this.props.children;
  }
}

export default ErrorBoundary;
