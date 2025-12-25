import React from 'react';
import { Link } from 'react-router-dom';
import "../../styles/footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-content">
        {/* About Section */}
        <div className="footer-nav-section">
          <div className="footer-logo">
            <span>JobPortal</span>
          </div>
          <p className="footer-description">
            India's leading job portal connecting talented professionals 
            with top companies. Find your dream job today.
          </p>
          <div className="footer-social">
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="Twitter">𝕏</a>
            <a href="#" aria-label="LinkedIn">in</a>
            <a href="#" aria-label="Instagram">📷</a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-nav-section">
          <h4 className="footer-nav-title">Quick Links</h4>
          <nav className="footer-nav" aria-label="Quick links">
            <ul>
              <li><Link to="/home">Home</Link></li>
              <li><Link to="/jobs">Browse Jobs</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </nav>
        </div>

        {/* For Job Seekers */}
        <div className="footer-nav-section">
          <h4 className="footer-nav-title">Job Seekers</h4>
          <nav className="footer-nav" aria-label="Job seeker links">
            <ul>
              <li><a href="#">Create Resume</a></li>
              <li><a href="#">Job Alerts</a></li>
              <li><a href="#">Career Advice</a></li>
              <li><a href="#">Skill Tests</a></li>
            </ul>
          </nav>
        </div>

        {/* For Employers */}
        <div className="footer-nav-section">
          <h4 className="footer-nav-title">Employers</h4>
          <nav className="footer-nav" aria-label="Employer links">
            <ul>
              <li><a href="#">Post a Job</a></li>
              <li><a href="#">Search Resumes</a></li>
              <li><a href="#">Recruitment Solutions</a></li>
              <li><a href="#">Pricing</a></li>
            </ul>
          </nav>
        </div>
      </div>
      
      <div className="footer-copyright">
        <p>© {currentYear} JobPortal. All rights reserved. | Privacy Policy | Terms of Service</p>
      </div>
    </footer>
  );
};

export default Footer;
