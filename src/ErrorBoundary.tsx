import { ReactNode, Component, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] 에러 캐치됨:', error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return this.props.fallback ? (
        this.props.fallback(this.state.error, this.reset)
      ) : (
        <div
          style={{
            padding: 16,
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: 4,
          }}
        >
          <h3 style={{ margin: '0 0 8px 0', color: '#c33' }}>
            에러 발생
          </h3>
          <p style={{ margin: '0 0 12px 0', color: '#666' }}>
            {this.state.error.message}
          </p>
          <button onClick={this.reset}>리셋</button>
        </div>
      );
    }

    return this.props.children;
  }
}
