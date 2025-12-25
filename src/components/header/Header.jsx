import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../common/Logo';
import "../../styles/header.css";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showJobSeekersMenu, setShowJobSeekersMenu] = useState(false);
  const [showEmployersMenu, setShowEmployersMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, isHR, logout } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => {
    if (path === '/home') {
      return location.pathname === '/' || location.pathname === '/home';
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/home');
    setShowUserMenu(false);
  };

  const navLinks = [
    { path: '/home', label: 'Home' },
    ...(isHR ? [] : [{ path: '/jobs', label: 'Find Jobs' }]), // Hide "Find Jobs" for HR users
    { path: '/about', label: 'About Us' },
    { path: '/contact', label: 'Contact Us' },
  ];

  return (
    <header className="header" role="banner">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <div className="header-content">
        <Link to="/home" className="logo" aria-label="AuraHire - Go to homepage">
          <Logo size="medium" showText={true} />
        </Link>
        
        <div className="tagline" aria-hidden="true">
          <span>Find Your Dream Career</span>
        </div>
        
        <button 
          className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-expanded={isMobileMenuOpen}
          aria-controls="main-navigation"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav 
          id="main-navigation" 
          className={isMobileMenuOpen ? 'mobile-open' : ''}
          role="navigation"
          aria-label="Main navigation"
        >
          <ul>
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link 
                  to={link.path} 
                  className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                  aria-current={isActive(link.path) ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            
            {/* Job Seekers Dropdown - Only show if not HR */}
            {!isHR && (
              <li className="nav-dropdown">
                <button
                  className={`nav-link ${showJobSeekersMenu ? 'active' : ''}`}
                  onClick={() => {
                    setShowJobSeekersMenu(!showJobSeekersMenu);
                    setShowEmployersMenu(false);
                  }}
                >
                  Job Seekers ▼
                </button>
                {showJobSeekersMenu && (
                  <div className="dropdown-menu">
                    <Link to="/resume-builder" onClick={closeMobileMenu}>📝 Create Resume</Link>
                    <Link to="/job-alerts" onClick={closeMobileMenu}>🔔 Job Alerts</Link>
                    <Link to="/career-advice" onClick={closeMobileMenu}>💡 Career Advice</Link>
                    <Link to="/skill-tests" onClick={closeMobileMenu}>📊 Skill Tests</Link>
                  </div>
                )}
              </li>
            )}

            {/* Employers Dropdown - Show for everyone, but highlight HR features */}
            <li className="nav-dropdown">
              <button
                className={`nav-link ${showEmployersMenu ? 'active' : ''}`}
                onClick={() => {
                  setShowEmployersMenu(!showEmployersMenu);
                  setShowJobSeekersMenu(false);
                }}
              >
                Employers ▼
              </button>
              {showEmployersMenu && (
                <div className="dropdown-menu">
                  {isAuthenticated && isHR ? (
                    <>
                      <Link to="/hr/dashboard" onClick={closeMobileMenu}>📝 Post a Job</Link>
                      <Link to="/hr/resume-search" onClick={closeMobileMenu}>🔍 Search Resumes</Link>
                      <Link to="/recruitment-solutions" onClick={closeMobileMenu}>💼 Recruitment Solutions</Link>
                      <Link to="/pricing" onClick={closeMobileMenu}>💰 Pricing</Link>
                    </>
                  ) : (
                    <>
                      <Link to="/recruitment-solutions" onClick={closeMobileMenu}>💼 Recruitment Solutions</Link>
                      <Link to="/pricing" onClick={closeMobileMenu}>💰 Pricing</Link>
                      {!isAuthenticated && (
                        <Link to="/signup" onClick={closeMobileMenu}>🚀 Get Started as Employer</Link>
                      )}
                    </>
                  )}
                </div>
              )}
            </li>
          </ul>
        </nav>

        <div className="header-actions">
          {isAuthenticated ? (
            <div className="user-menu-container">
              <button 
                className="user-menu-trigger"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="user-avatar">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span className="user-name">{user?.name?.split(' ')[0]}</span>
                <span className="dropdown-arrow">▼</span>
              </button>

              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <strong>{user?.name}</strong>
                    <span>{user?.email}</span>
                    <span className="role-badge">{isHR ? 'Employer' : 'Job Seeker'}</span>
                  </div>
                  <div className="dropdown-divider"></div>
                  
                  {isHR ? (
                    <>
                      <Link to="/hr/dashboard" onClick={() => setShowUserMenu(false)}>
                        📊 Dashboard
                      </Link>
                      <Link to="/hr/resume-search" onClick={() => setShowUserMenu(false)}>
                        🔍 Search Resumes
                      </Link>
                      <Link to="/pricing" onClick={() => setShowUserMenu(false)}>
                        💰 Pricing
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/profile" onClick={() => setShowUserMenu(false)}>
                        👤 My Profile
                      </Link>
                      <Link to="/resume-builder" onClick={() => setShowUserMenu(false)}>
                        📝 Create Resume
                      </Link>
                      <Link to="/my-applications" onClick={() => setShowUserMenu(false)}>
                        📋 My Applications
                      </Link>
                      <Link to="/saved-jobs" onClick={() => setShowUserMenu(false)}>
                        ❤️ Saved Jobs
                      </Link>
                      <Link to="/job-alerts" onClick={() => setShowUserMenu(false)}>
                        🔔 Job Alerts
                      </Link>
                      <Link to="/skill-tests" onClick={() => setShowUserMenu(false)}>
                        📊 Skill Tests
                      </Link>
                    </>
                  )}
                  
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="logout-btn">
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-btn">Login</Link>
              <Link to="/signup" className="signup-btn">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
