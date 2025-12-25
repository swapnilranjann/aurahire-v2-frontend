import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../common/Logo';
import "../../styles/footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-content">
        {/* About Section */}
        <div className="footer-nav-section">
          <div className="footer-logo">
            <Logo size="medium" showText={true} />
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
              <li><Link to="/resume-builder">Create Resume</Link></li>
              <li><Link to="/job-alerts">Job Alerts</Link></li>
              <li><Link to="/career-advice">Career Advice</Link></li>
              <li><Link to="/skill-tests">Skill Tests</Link></li>
            </ul>
          </nav>
        </div>

        {/* For Employers */}
        <div className="footer-nav-section">
          <h4 className="footer-nav-title">Employers</h4>
          <nav className="footer-nav" aria-label="Employer links">
            <ul>
              <li><Link to="/hr/dashboard">Post a Job</Link></li>
              <li><Link to="/hr/resume-search">Search Resumes</Link></li>
              <li><Link to="/recruitment-solutions">Recruitment Solutions</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
            </ul>
          </nav>
        </div>
      </div>
      
      <div className="footer-copyright">
        <p>© {currentYear} AuraHire. All rights reserved. | Privacy Policy | Terms of Service</p>
      </div>
    </footer>
  );
};

export default Footer;
