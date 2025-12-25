import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import '../../styles/Auth.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isHR, setIsHR] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
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

    const result = await signup(
      formData.name,
      formData.email,
      formData.password,
      isHR
    );

    if (result.success) {
      toast.success(result.message || 'Account created! Please verify your email.');
      navigate('/verify-email-notice');
    } else {
      toast.error(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Create Account</h1>
            <p>Start your career journey today</p>
          </div>

          <div className="auth-toggle">
            <button 
              className={!isHR ? 'active' : ''} 
              onClick={() => setIsHR(false)}
            >
              Job Seeker
            </button>
            <button 
              className={isHR ? 'active' : ''} 
              onClick={() => setIsHR(true)}
            >
              Employer / HR
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
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
                placeholder="Confirm your password"
                required
              />
            </div>

            <div className="form-terms">
              <label>
                <input type="checkbox" required />
                <span>
                  I agree to the <Link to="/terms">Terms of Service</Link> and{' '}
                  <Link to="/privacy">Privacy Policy</Link>
                </span>
              </label>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login">Sign In</Link>
            </p>
          </div>
        </div>

        <div className="auth-side signup-side">
          <div className="auth-side-content">
            <h2>{isHR ? 'Hire Top Talent' : 'Launch Your Career'}</h2>
            <p>
              {isHR 
                ? 'Post jobs and connect with qualified candidates from across India.'
                : 'Join thousands of professionals who found their dream jobs through AuraHire.'}
            </p>
            <div className="auth-features">
              {isHR ? (
                <>
                  <div className="feature">
                    <span className="feature-icon">📋</span>
                    <span>Post Unlimited Jobs</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon">👥</span>
                    <span>Access Talent Pool</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon">📊</span>
                    <span>Track Applications</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="feature">
                    <span className="feature-icon">📝</span>
                    <span>Build Your Profile</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon">🔔</span>
                    <span>Job Alerts</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon">📈</span>
                    <span>Track Applications</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;


