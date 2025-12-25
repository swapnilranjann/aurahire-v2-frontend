import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import "../../styles/header.css";
import logo from "../assets/logo.png";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
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

  const navLinks = isHR ? [
    { path: '/home', label: 'Home' },
    { path: '/hr/dashboard', label: 'Dashboard' },
    { path: '/about', label: 'About Us' },
    { path: '/contact', label: 'Contact Us' },
  ] : [
    { path: '/home', label: 'Home' },
    { path: '/jobs', label: 'Find Jobs' },
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
          <img src={logo} alt="" className="logo-image" aria-hidden="true" />
          <span className="logo-title">AuraHire</span>
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
                      <Link to="/hr/post-job" onClick={() => setShowUserMenu(false)}>
                        ➕ Post a Job
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/profile" onClick={() => setShowUserMenu(false)}>
                        👤 My Profile
                      </Link>
                      <Link to="/my-applications" onClick={() => setShowUserMenu(false)}>
                        📋 My Applications
                      </Link>
                      <Link to="/saved-jobs" onClick={() => setShowUserMenu(false)}>
                        ❤️ Saved Jobs
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
