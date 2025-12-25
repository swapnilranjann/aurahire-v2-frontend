import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import '../../styles/Auth.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const result = await resetPassword(token, formData.password);

    if (result.success) {
      setSuccess(true);
      toast.success('Password reset successfully!');
      setTimeout(() => navigate('/login'), 3000);
    } else {
      toast.error(result.error);
    }

    setLoading(false);
  };

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-container single">
          <div className="auth-card">
            <div className="auth-header">
              <div className="error-icon">❌</div>
              <h1>Invalid Link</h1>
              <p>This password reset link is invalid or has expired.</p>
            </div>

            <Link to="/forgot-password" className="auth-btn">
              Request New Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-container single">
          <div className="auth-card">
            <div className="auth-header">
              <div className="success-icon">✅</div>
              <h1>Password Reset!</h1>
              <p>Your password has been successfully reset. Redirecting to login...</p>
            </div>

            <Link to="/login" className="auth-btn">
              Go to Login
            </Link>
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
            <h1>Reset Password</h1>
            <p>Enter your new password below</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="password">New Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter new password"
                required
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                required
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              <Link to="/login">← Back to Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;


