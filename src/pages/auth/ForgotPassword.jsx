import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import '../../styles/Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await forgotPassword(email);

    if (result.success) {
      setSent(true);
      toast.success('Password reset link sent to your email!');
    } else {
      toast.error(result.error);
    }

    setLoading(false);
  };

  if (sent) {
    return (
      <div className="auth-page">
        <div className="auth-container single">
          <div className="auth-card">
            <div className="auth-header">
              <div className="success-icon">✉️</div>
              <h1>Check Your Email</h1>
              <p>
                We've sent a password reset link to <strong>{email}</strong>.
                Please check your inbox and follow the instructions.
              </p>
            </div>

            <div className="auth-info">
              <p>Didn't receive the email?</p>
              <button 
                onClick={() => setSent(false)} 
                className="auth-btn secondary"
              >
                Try Again
              </button>
            </div>

            <div className="auth-footer">
              <p>
                <Link to="/login">← Back to Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container single">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Forgot Password?</h1>
            <p>No worries! Enter your email and we'll send you a reset link.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                required
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Remember your password?{' '}
              <Link to="/login">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;


