import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Auth.css';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const { verifyEmail } = useAuth();

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      const result = await verifyEmail(token);
      
      if (result.success) {
        setStatus('success');
        setMessage(result.message);
      } else {
        setStatus('error');
        setMessage(result.error);
      }
    };

    verify();
  }, [token, verifyEmail]);

  return (
    <div className="auth-page">
      <div className="auth-container single">
        <div className="auth-card">
          {status === 'verifying' && (
            <div className="auth-header">
              <div className="loading-spinner"></div>
              <h1>Verifying Email...</h1>
              <p>Please wait while we verify your email address.</p>
            </div>
          )}

          {status === 'success' && (
            <>
              <div className="auth-header">
                <div className="success-icon">✅</div>
                <h1>Email Verified!</h1>
                <p>{message}</p>
              </div>

              <Link to="/jobs" className="auth-btn">
                Browse Jobs
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="auth-header">
                <div className="error-icon">❌</div>
                <h1>Verification Failed</h1>
                <p>{message}</p>
              </div>

              <Link to="/login" className="auth-btn">
                Go to Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;


