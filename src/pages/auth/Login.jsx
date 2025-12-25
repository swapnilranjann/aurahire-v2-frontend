import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import '../../styles/Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isHR, setIsHR] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || (isHR ? '/hr/dashboard' : '/jobs');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData.email, formData.password, isHR);

    if (result.success) {
      toast.success('Login successful!');
      navigate(from, { replace: true });
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
            <h1>Welcome Back</h1>
            <p>Sign in to continue your journey</p>
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
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/signup">Create Account</Link>
            </p>
          </div>
        </div>

        <div className="auth-side">
          <div className="auth-side-content">
            <h2>Find Your Dream Job</h2>
            <p>Connect with top employers and discover opportunities that match your skills and aspirations.</p>
            <div className="auth-features">
              <div className="feature">
                <span className="feature-icon">🎯</span>
                <span>10,000+ Job Listings</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🏢</span>
                <span>1,000+ Companies</span>
              </div>
              <div className="feature">
                <span className="feature-icon">✨</span>
                <span>Easy Apply</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;


