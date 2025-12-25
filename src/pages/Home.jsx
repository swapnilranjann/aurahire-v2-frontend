import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import HeroSlider from "./HeroSlider";
import HeroSlider2 from './HeroSlider2';
import "../styles/Home.css";

const Home = () => {
  const { isAuthenticated, isHR } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [topCompanies, setTopCompanies] = useState([]);
  const [newsArticles, setNewsArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isHR) {
      fetchHomeData();
    } else {
      setLoading(false);
    }
  }, [isHR]);

  const fetchHomeData = async () => {
    try {
      const [jobsRes, companiesRes, newsRes] = await Promise.all([
        api.get('/home/featured-jobs').catch(() => ({ data: [] })),
        api.get('/home/top-companies').catch(() => ({ data: [] })),
        api.get('/home/career-news').catch(() => ({ data: [] })),
      ]);

      setJobs(jobsRes.data || []);
      setTopCompanies(companiesRes.data || []);
      setNewsArticles(newsRes.data || []);
    } catch (error) {
      console.error('Error fetching home data:', error);
      setJobs([]);
      setTopCompanies([]);
      setNewsArticles([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <article aria-label="Home page">
      {/* Hero Section with Search */}
      <section className="home-hero">
        {isHR ? (
          <>
            <h1>Find the Perfect Candidates</h1>
            <p>Post jobs and search through thousands of qualified resumes</p>
          </>
        ) : (
          <>
            <h1>Find Your Dream Job Today</h1>
            <p>Search from 10,000+ jobs from top companies</p>
          </>
        )}
        
        <div className="search-box">
          {isHR ? (
            <>
              <input 
                type="text" 
                placeholder="Search candidates by skills, location..."
                aria-label="Search for candidates"
              />
              <Link to="/hr/resume-search">
                <button type="button">Search Resumes</button>
              </Link>
            </>
          ) : (
            <>
              <input 
                type="text" 
                placeholder="Job title, skills, or company"
                aria-label="Search for jobs"
              />
              <Link to="/jobs">
                <button type="button">Search Jobs</button>
              </Link>
            </>
          )}
        </div>
        
        {!isHR && (
          <div className="popular-searches">
            <span>Popular:</span>
            <Link to="/jobs">Software Engineer</Link>
            <Link to="/jobs">Data Scientist</Link>
            <Link to="/jobs">Product Manager</Link>
            <Link to="/jobs">UX Designer</Link>
          </div>
        )}
        
        {isHR && isAuthenticated && (
          <div className="quick-actions" style={{ marginTop: '20px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link to="/hr/dashboard" className="btn-primary" style={{ padding: '12px 24px', borderRadius: '8px' }}>
              📝 Post a Job
            </Link>
            <Link to="/hr/resume-search" className="btn-primary" style={{ padding: '12px 24px', borderRadius: '8px' }}>
              🔍 Search Resumes
            </Link>
            <Link to="/pricing" className="btn-primary" style={{ padding: '12px 24px', borderRadius: '8px' }}>
              💰 View Pricing
            </Link>
          </div>
        )}
        
        {!isAuthenticated && (
          <div className="quick-actions" style={{ marginTop: '20px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link to="/signup" className="btn-primary" style={{ padding: '12px 24px', borderRadius: '8px' }}>
              Get Started
            </Link>
            <Link to="/jobs" className="btn-primary" style={{ padding: '12px 24px', borderRadius: '8px', background: 'transparent', border: '2px solid var(--primary-600)' }}>
              Browse Jobs
            </Link>
          </div>
        )}
      </section>

      {/* Featured Jobs - Only show for job seekers */}
      {!isHR && (
        <section className="job-display" aria-labelledby="featured-jobs-heading">
          <h2 id="featured-jobs-heading">Featured Jobs</h2>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>Loading jobs...</div>
          ) : jobs.length > 0 ? (
            <div className="job-container">
              {jobs.map((job) => (
                <article className="job-card" key={job.id}>
                  <div className="job-card-header">
                    <div className="company-logo" aria-hidden="true">
                      {job.company?.charAt(0) || 'J'}
                    </div>
                    <div className="job-info">
                      <h3 className="job-title">{job.title}</h3>
                      <p className="job-company">{job.company}</p>
                    </div>
                  </div>
                  
                  <div className="job-meta">
                    {job.experience && (
                      <span className="job-meta-item">
                        <span className="icon">💼</span> {job.experience}
                      </span>
                    )}
                    {job.salary && (
                      <span className="job-meta-item">
                        <span className="icon">₹</span> {job.salary}
                      </span>
                    )}
                    {job.location && (
                      <span className="job-meta-item">
                        <span className="icon">📍</span> {job.location}
                      </span>
                    )}
                  </div>
                  
                  {job.description && (
                    <p className="job-description">{job.description}</p>
                  )}
                  
                  {job.skills && job.skills.length > 0 && (
                    <div className="job-skills">
                      {job.skills.map((skill, i) => (
                        <span className="skill" key={i}>{skill}</span>
                      ))}
                    </div>
                  )}
                  
                  <div className="job-footer">
                    <span className="job-posted">{job.posted || 'Recently'}</span>
                    <Link to={`/job/${job.id}`} className="btn-primary" style={{padding: '8px 20px', fontSize: '13px', borderRadius: '20px'}}>
                      View Details
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
              No featured jobs available at the moment. Check back soon!
            </div>
          )}
        </section>
      )}

      {/* Top Companies - Only show for job seekers */}
      {!isHR && (
        <section className="top-companies">
          <h2>Top Companies Hiring</h2>
          {topCompanies.length > 0 ? (
            <div className="companies-grid">
              {topCompanies.map((company, index) => (
                <div className="company-card" key={index}>
                  <div className="logo-placeholder">{company.icon}</div>
                  <div className="name">{company.name}</div>
                  <div className="jobs-count">{company.jobs}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
              Company data loading...
            </div>
          )}
        </section>
      )}

      {!isHR && <HeroSlider />}

      {/* News Section - Show different content for HR */}
      <section className="news-articles" aria-labelledby="news-heading">
        <h2 id="news-heading">{isHR ? 'Recruitment Insights' : 'Career News & Insights'}</h2>
        {newsArticles.length > 0 ? (
          <div className="news-container">
            {newsArticles.map((article, index) => (
              <article className="news-card" key={index}>
                <h3 className="news-title">{article.title}</h3>
                <p className="news-summary">{article.summary}</p>
                <Link to={article.link} className="news-link">
                  Read more →
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
            {!isHR && <p>Check out our <Link to="/career-advice">Career Advice</Link> section for insights!</p>}
          </div>
        )}
      </section>

      {!isHR && <HeroSlider2 />}

      {/* Testimonials - Show different for HR */}
      {!isHR && (
        <section className="testimonials" aria-labelledby="testimonials-heading">
          <h2 id="testimonials-heading">Success Stories</h2>
          <div className="testimonial-container">
            <article className="testimonial-card">
              <div className="testimonial-avatar">R</div>
              <h3 className="testimonial-name">Rahul Sharma</h3>
              <p className="testimonial-role">Software Engineer</p>
              <blockquote className="testimonial-feedback">
                "Found my dream job within 2 weeks! The platform made job searching so easy and efficient."
              </blockquote>
            </article>
            <article className="testimonial-card">
              <div className="testimonial-avatar">P</div>
              <h3 className="testimonial-name">Priya Patel</h3>
              <p className="testimonial-role">Product Manager</p>
              <blockquote className="testimonial-feedback">
                "Excellent experience! The job recommendations were spot-on for my profile and skills."
              </blockquote>
            </article>
            <article className="testimonial-card">
              <div className="testimonial-avatar">A</div>
              <h3 className="testimonial-name">Amit Kumar</h3>
              <p className="testimonial-role">Data Scientist</p>
              <blockquote className="testimonial-feedback">
                "Best job portal I've used. Clean interface and quality job listings from top companies."
              </blockquote>
            </article>
          </div>
        </section>
      )}

      {/* Video Section - Only for job seekers */}
      {!isHR && (
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
      )}
    </article>
  );
};

export default Home;
