import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <article style={styles.container} role="main" aria-label="Page not found">
      <div style={styles.content}>
        <div style={styles.errorCode}>404</div>
        <h1 style={styles.title}>Page Not Found</h1>
        <p style={styles.message}>
          Oops! The page you're looking for doesn't exist or has been moved.
          Don't worry, let's get you back on track.
        </p>
        <div style={styles.actions}>
          <Link 
            to="/home" 
            style={styles.primaryButton}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.3)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Go to Home
          </Link>
          <Link 
            to="/jobs" 
            style={styles.secondaryButton}
            onMouseOver={(e) => {
              e.target.style.background = '#667eea';
              e.target.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#667eea';
            }}
          >
            Browse Jobs
          </Link>
        </div>
        <div style={styles.helpLinks}>
          <p style={styles.helpText}>You might also want to:</p>
          <nav style={styles.linksContainer} aria-label="Helpful links">
            <Link to="/about" style={styles.helpLink}>Learn about us</Link>
            <span style={styles.divider}>•</span>
            <Link to="/contact" style={styles.helpLink}>Contact support</Link>
          </nav>
        </div>
      </div>
    </article>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 200px)',
    padding: '2rem',
    background: 'linear-gradient(180deg, #f8faff 0%, #ffffff 100%)',
  },
  content: {
    textAlign: 'center',
    maxWidth: '500px',
    padding: '3rem 2rem',
  },
  errorCode: {
    fontSize: '8rem',
    fontWeight: '800',
    lineHeight: '1',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '1rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '1rem',
  },
  message: {
    fontSize: '1.1rem',
    color: '#4a5568',
    lineHeight: '1.6',
    marginBottom: '2rem',
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '2rem',
  },
  primaryButton: {
    display: 'inline-block',
    padding: '1rem 2rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
  },
  secondaryButton: {
    display: 'inline-block',
    padding: '1rem 2rem',
    background: 'transparent',
    color: '#667eea',
    border: '2px solid #667eea',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
  },
  helpLinks: {
    paddingTop: '2rem',
    borderTop: '1px solid #e2e8f0',
  },
  helpText: {
    fontSize: '0.95rem',
    color: '#718096',
    marginBottom: '0.75rem',
  },
  linksContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.75rem',
  },
  helpLink: {
    color: '#667eea',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: '500',
  },
  divider: {
    color: '#cbd5e0',
  },
};

export default NotFound;


