import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/About.css';

const stats = [
  { number: '10K+', label: 'Jobs Posted' },
  { number: '50K+', label: 'Job Seekers' },
  { number: '1K+', label: 'Companies' },
  { number: '95%', label: 'Success Rate' },
];

const About = () => {
  return (
    <article className="about">
      {/* Hero Section */}
      <section className="about-hero">
        <h1>About JobPortal</h1>
        <p>
          India's leading job portal connecting talented professionals 
          with their dream careers since 2020.
        </p>
      </section>

      {/* Statistics */}
      <section className="about-stats" aria-label="Company statistics">
        {stats.map((stat, index) => (
          <div className="stat-card" key={index}>
            <div className="stat-number">{stat.number}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Content */}
      <div className="about-content">
        <p className="intro">
          Welcome to <strong>JobPortal</strong>! We are committed to providing the best 
          job matching services to connect talented professionals with outstanding 
          opportunities. Our platform makes job searching simple, efficient, and effective.
        </p>
        
        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            Our mission is to bridge the gap between talented job seekers and 
            quality employers. We believe everyone deserves access to meaningful 
            work opportunities, and we're dedicated to making the job search 
            process as smooth as possible.
          </p>
        </section>
        
        <section className="about-section">
          <h2>What We Offer</h2>
          <p>
            We provide a comprehensive suite of services including job listings 
            from top companies, resume building tools, skill assessments, and 
            personalized job recommendations. Our platform uses advanced matching 
            algorithms to connect you with the right opportunities.
          </p>
        </section>
        
        <section className="about-section">
          <h2>Our Team</h2>
          <p>
            Our team is composed of experienced professionals who are passionate 
            about connecting people with their dream careers. We foster a 
            collaborative environment that encourages innovation and puts 
            job seekers first.
          </p>
        </section>
        
        <section className="about-section">
          <h2>Get Started</h2>
          <p>
            Ready to find your next opportunity? Browse our latest 
            <Link to="/jobs"> job listings</Link> or <Link to="/contact">contact us</Link> if 
            you have any questions. We're here to help you succeed!
          </p>
        </section>
      </div>
    </article>
  );
};

export default About;
