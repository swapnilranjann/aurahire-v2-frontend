import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console in development
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container} role="alert" aria-live="assertive">
          <div style={styles.content}>
            <div style={styles.icon} aria-hidden="true">⚠️</div>
            <h1 style={styles.title}>Oops! Something went wrong</h1>
            <p style={styles.message}>
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <button 
              onClick={this.handleReload} 
              style={styles.button}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.3)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Refresh Page
            </button>
            <a 
              href="/home" 
              style={styles.link}
              onMouseOver={(e) => e.target.style.color = '#764ba2'}
              onMouseOut={(e) => e.target.style.color = '#667eea'}
            >
              Go to Home Page
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '2rem',
    background: 'linear-gradient(180deg, #f8faff 0%, #ffffff 100%)',
  },
  content: {
    textAlign: 'center',
    maxWidth: '500px',
    padding: '3rem',
    background: 'white',
    borderRadius: '20px',
    boxShadow: '0 10px 40px rgba(102, 126, 234, 0.1)',
  },
  icon: {
    fontSize: '4rem',
    marginBottom: '1.5rem',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '1rem',
  },
  message: {
    fontSize: '1rem',
    color: '#4a5568',
    lineHeight: '1.6',
    marginBottom: '2rem',
  },
  button: {
    display: 'inline-block',
    padding: '1rem 2rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginBottom: '1rem',
  },
  link: {
    display: 'block',
    color: '#667eea',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: '500',
    transition: 'color 0.3s ease',
  },
};

export default ErrorBoundary;


