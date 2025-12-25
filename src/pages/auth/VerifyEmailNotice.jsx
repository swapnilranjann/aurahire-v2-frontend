import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import '../../styles/Auth.css';

const VerifyEmailNotice = () => {
  const [loading, setLoading] = useState(false);
  const { user, resendVerification } = useAuth();

  const handleResend = async () => {
    setLoading(true);
    const result = await resendVerification();
    
    if (result.success) {
      toast.success('Verification email sent!');
    } else {
      toast.error(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container single">
        <div className="auth-card">
          <div className="auth-header">
            <div className="success-icon">📧</div>
            <h1>Verify Your Email</h1>
            <p>
              We've sent a verification link to{' '}
              <strong>{user?.email || 'your email'}</strong>.
              Please check your inbox and click the link to verify your account.
            </p>
          </div>

          <div className="verify-info">
            <h3>What's next?</h3>
            <ul>
              <li>Check your email inbox</li>
              <li>Click the verification link</li>
              <li>Start exploring jobs!</li>
            </ul>
          </div>

          <div className="auth-actions">
            <button 
              onClick={handleResend} 
              className="auth-btn secondary"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Resend Email'}
            </button>
            
            <Link to="/jobs" className="auth-btn">
              Continue to Jobs
            </Link>
          </div>

          <div className="auth-footer">
            <p>
              Wrong email? <Link to="/signup">Sign up again</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailNotice;


