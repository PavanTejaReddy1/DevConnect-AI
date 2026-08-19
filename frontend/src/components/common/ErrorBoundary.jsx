import { Component } from 'react';
import AmbientBackground from './AmbientBackground.jsx';
import Button from '../ui/Button.jsx';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="page-shell flex min-h-screen items-center justify-center p-4">
          <AmbientBackground />
          <div className="glass-card relative z-10 max-w-md p-8 text-center">
            <h1 className="mb-2 text-2xl font-bold text-text">Something went wrong</h1>
            <p className="mb-6 text-text/60">
              An unexpected error occurred. Please refresh the page or try again later.
            </p>
            <Button onClick={() => window.location.reload()}>Refresh Page</Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
