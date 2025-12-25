import React from 'react';
import './Logo.css';

const Logo = ({ size = 'medium', showText = true }) => {
  const sizes = {
    small: { width: 32, height: 32, fontSize: '18px' },
    medium: { width: 40, height: 40, fontSize: '22px' },
    large: { width: 56, height: 56, fontSize: '28px' },
  };

  const currentSize = sizes[size] || sizes.medium;

  return (
    <div className="logo-container">
      <svg
        width={currentSize.width}
        height={currentSize.height}
        viewBox="0 0 120 120"
        className="logo-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#a855f7', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        
        {/* Main Circle Background */}
        <circle cx="60" cy="60" r="55" fill="url(#logoGradient)" />
        
        {/* Letter A - Stylized */}
        <path
          d="M 40 90 L 50 70 L 70 70 L 80 90 M 50 80 L 75 80"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        
        {/* Sparkle/Star effect */}
        <circle cx="75" cy="45" r="3" fill="white" opacity="0.9" />
        <circle cx="85" cy="50" r="2" fill="white" opacity="0.7" />
        <circle cx="35" cy="50" r="2.5" fill="white" opacity="0.8" />
      </svg>
      
      {showText && (
        <span className="logo-text" style={{ fontSize: currentSize.fontSize }}>
          AuraHire
        </span>
      )}
    </div>
  );
};

export default Logo;

