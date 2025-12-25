import React from 'react';
import { Link } from 'react-router-dom';
import HeroSlider from "./HeroSlider";
import HeroSlider2 from './HeroSlider2';
import "../styles/Home.css";

const jobs = [
  {
    title: "Senior Software Engineer",
    company: "Google India",
    rating: 4.3,
    experience: "5-8 yrs",
    salary: "₹25-45 LPA",
    location: "Bangalore",
    skills: ["React", "Node.js", "Python"],
    posted: "2 days ago",
    description: "Build next-generation cloud solutions with cutting-edge technologies."
  },
  {
    title: "Product Manager",
    company: "Microsoft",
    rating: 4.1,
    experience: "4-7 yrs",
    salary: "₹30-50 LPA",
    location: "Hyderabad",
    skills: ["Product Strategy", "Agile", "Analytics"],
    posted: "1 day ago",
    description: "Lead product strategy and roadmap for enterprise solutions."
  },
  {
    title: "UX Designer",
    company: "Flipkart",
    rating: 4.0,
    experience: "3-5 yrs",
    salary: "₹18-28 LPA",
    location: "Bangalore",
    skills: ["Figma", "User Research", "Prototyping"],
    posted: "3 days ago",
    description: "Create beautiful experiences for millions of users daily."
  }
];

const newsArticles = [
  {
    title: "Tech Hiring Surges in Q4 2025",
    summary: "Major tech companies announce aggressive hiring plans for software engineers and data scientists.",
    link: "#"
  },
  {
    title: "Remote Work Trends Continue",
    summary: "70% of companies now offer hybrid work options. Learn how to find remote opportunities.",
    link: "#"
  },
  {
    title: "Top Skills for 2026",
    summary: "AI, Cloud Computing, and Cybersecurity skills are most in-demand according to industry reports.",
    link: "#"
  }
];

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Software Engineer at Google",
    initial: "R",
    feedback: "Found my dream job within 2 weeks! The platform made job searching so easy and efficient."
  },
  {
    name: "Priya Patel",
    role: "Product Manager at Amazon",
    initial: "P",
    feedback: "Excellent experience! The job recommendations were spot-on for my profile and skills."
  },
  {
    name: "Amit Kumar",
    role: "Data Scientist at Microsoft",
    initial: "A",
    feedback: "Best job portal I've used. Clean interface and quality job listings from top companies."
  }
];

const topCompanies = [
  { name: "Google", jobs: "250+ Jobs", icon: "G" },
  { name: "Microsoft", jobs: "180+ Jobs", icon: "M" },
  { name: "Amazon", jobs: "320+ Jobs", icon: "A" },
  { name: "Flipkart", jobs: "95+ Jobs", icon: "F" },
  { name: "Infosys", jobs: "450+ Jobs", icon: "I" },
  { name: "TCS", jobs: "520+ Jobs", icon: "T" },
];

const Home = () => {
  return (
    <article aria-label="Home page">
      {/* Hero Section with Search */}
      <section className="home-hero">
        <h1>Find Your Dream Job Today</h1>
        <p>Search from 10,000+ jobs from top companies</p>
        
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Job title, skills, or company"
            aria-label="Search for jobs"
          />
          <button type="button">Search Jobs</button>
        </div>
        
        <div className="popular-searches">
          <span>Popular:</span>
          <Link to="/jobs">Software Engineer</Link>
          <Link to="/jobs">Data Scientist</Link>
          <Link to="/jobs">Product Manager</Link>
          <Link to="/jobs">UX Designer</Link>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="job-display" aria-labelledby="featured-jobs-heading">
        <h2 id="featured-jobs-heading">Featured Jobs</h2>
        <div className="job-container">
          {jobs.map((job, index) => (
            <article className="job-card" key={index}>
              <div className="job-card-header">
                <div className="company-logo" aria-hidden="true">
                  {job.company.charAt(0)}
                </div>
                <div className="job-info">
                  <h3 className="job-title">{job.title}</h3>
                  <p className="job-company">
                    {job.company}
                    <span className="rating">
                      <span className="star">★</span> {job.rating}
                    </span>
                  </p>
                </div>
              </div>
              
              <div className="job-meta">
                <span className="job-meta-item">
                  <span className="icon">💼</span> {job.experience}
                </span>
                <span className="job-meta-item">
                  <span className="icon">₹</span> {job.salary}
                </span>
                <span className="job-meta-item">
                  <span className="icon">📍</span> {job.location}
                </span>
              </div>
              
              <p className="job-description">{job.description}</p>
              
              <div className="job-skills">
                {job.skills.map((skill, i) => (
                  <span className="skill" key={i}>{skill}</span>
                ))}
              </div>
              
              <div className="job-footer">
                <span className="job-posted">{job.posted}</span>
                <Link to="/jobs" className="btn-primary" style={{padding: '8px 20px', fontSize: '13px', borderRadius: '20px'}}>
                  Apply Now
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Top Companies */}
      <section className="top-companies">
        <h2>Top Companies Hiring</h2>
        <div className="companies-grid">
          {topCompanies.map((company, index) => (
            <div className="company-card" key={index}>
              <div className="logo-placeholder">{company.icon}</div>
              <div className="name">{company.name}</div>
              <div className="jobs-count">{company.jobs}</div>
            </div>
          ))}
        </div>
      </section>

      <HeroSlider />

      {/* News Section */}
      <section className="news-articles" aria-labelledby="news-heading">
        <h2 id="news-heading">Career News & Insights</h2>
        <div className="news-container">
          {newsArticles.map((article, index) => (
            <article className="news-card" key={index}>
              <h3 className="news-title">{article.title}</h3>
              <p className="news-summary">{article.summary}</p>
              <a href={article.link} className="news-link">
                Read more →
              </a>
            </article>
          ))}
        </div>
      </section>

      <HeroSlider2 />

      {/* Testimonials */}
      <section className="testimonials" aria-labelledby="testimonials-heading">
        <h2 id="testimonials-heading">Success Stories</h2>
        <div className="testimonial-container">
          {testimonials.map((testimonial, index) => (
            <article className="testimonial-card" key={index}>
              <div className="testimonial-avatar">{testimonial.initial}</div>
              <h3 className="testimonial-name">{testimonial.name}</h3>
              <p className="testimonial-role">{testimonial.role}</p>
              <blockquote className="testimonial-feedback">
                "{testimonial.feedback}"
              </blockquote>
            </article>
          ))}
        </div>
      </section>

      {/* Video Section */}
      <section className="youtube-video" aria-labelledby="videos-heading">
        <h2 id="videos-heading">Career Tips & Resources</h2>
        <div className="video-container">
          <iframe
            src="https://www.youtube.com/embed/lwao2gqDoBU?si=M4Kru_PcbhJ6n_qF"
            title="Career tips video 1"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          ></iframe>
          <iframe
            src="https://www.youtube.com/embed/BSb3vOE9slE?si=nsQxaDtsf5BBX2tc"
            title="Career tips video 2"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </section>
    </article>
  );
};

export default Home;
