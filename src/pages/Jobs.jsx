import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { jobsAPI, savedJobsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/Jobs.css';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    category: '',
  });
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0,
  });
  const [applyingTo, setApplyingTo] = useState(null);

  const { isAuthenticated, user, isHR } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect HR users to their dashboard
    if (isHR) {
      navigate('/hr/dashboard', { replace: true });
      return;
    }
    
    fetchJobs();
    if (isAuthenticated) {
      fetchSavedJobs();
    }
    fetchFilters();
  }, [isAuthenticated, isHR, navigate]);

  const fetchJobs = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        page,
        limit: 10,
      };
      // Remove empty params
      Object.keys(params).forEach(key => !params[key] && delete params[key]);
      
      const response = await jobsAPI.getAll(params);
      setJobs(response.data.jobs || response.data);
      setPagination(response.data.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalJobs: response.data.length || 0,
      });
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to fetch jobs');
    }
    setLoading(false);
  };

  const fetchSavedJobs = async () => {
    try {
      const response = await savedJobsAPI.getAll();
      const savedIds = new Set(response.data.map(job => job.id));
      setSavedJobs(savedIds);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
    }
  };

  const fetchFilters = async () => {
    try {
      const [catRes, locRes] = await Promise.all([
        jobsAPI.getCategories(),
        jobsAPI.getLocations(),
      ]);
      setCategories(catRes.data || []);
      setLocations(locRes.data || []);
    } catch (error) {
      console.error('Error fetching filters:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(1);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSaveJob = async (jobId) => {
    if (!isAuthenticated) {
      toast.info('Please login to save jobs');
      navigate('/login');
      return;
    }

    try {
      if (savedJobs.has(jobId)) {
        await savedJobsAPI.unsave(jobId);
        setSavedJobs(prev => {
          const next = new Set(prev);
          next.delete(jobId);
          return next;
        });
        toast.success('Job removed from saved');
      } else {
        await savedJobsAPI.save(jobId);
        setSavedJobs(prev => new Set(prev).add(jobId));
        toast.success('Job saved!');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save job');
    }
  };

  const handleApply = async (job) => {
    if (!isAuthenticated) {
      toast.info('Please login to apply');
      navigate('/login', { state: { from: { pathname: '/jobs' } } });
      return;
    }

    setApplyingTo(job.id);
    try {
      await jobsAPI.apply(job.id, {
        user_id: user.id,
        email: user.email,
        name: user.name,
        job_id: job.id,
      });
      toast.success('Application submitted successfully!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to apply');
    }
    setApplyingTo(null);
  };

  const handlePageChange = (page) => {
    fetchJobs(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="jobs-page">
      {/* Hero Section with Search */}
      <section className="jobs-hero">
        <div className="hero-content">
          <h1>Find Your Perfect Job</h1>
          <p>Discover thousands of opportunities from top companies</p>
          
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-inputs">
              <div className="search-field">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  name="keyword"
                  placeholder="Job title, keywords, or company"
                  value={filters.keyword}
                  onChange={handleFilterChange}
                />
              </div>
              
              <div className="search-field">
                <span className="search-icon">📍</span>
                <select name="location" value={filters.location} onChange={handleFilterChange}>
                  <option value="">All Locations</option>
                  {locations.map((loc, i) => (
                    <option key={i} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
              
              <div className="search-field">
                <span className="search-icon">📁</span>
                <select name="category" value={filters.category} onChange={handleFilterChange}>
                  <option value="">All Categories</option>
                  {categories.map((cat, i) => (
                    <option key={i} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <button type="submit" className="search-btn">
                Search Jobs
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Jobs List */}
      <section className="jobs-section">
        <div className="jobs-header">
          <div className="jobs-count">
            Showing <strong>{jobs.length}</strong> of <strong>{pagination.totalJobs}</strong> jobs
          </div>
          <div className="jobs-sort">
            Sort by:
            <select defaultValue="relevance">
              <option value="relevance">Relevance</option>
              <option value="date">Date Posted</option>
              <option value="salary">Salary</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="jobs-loading">
            <div className="loading-spinner"></div>
            <p>Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="no-jobs">
            <h3>No jobs found</h3>
            <p>Try adjusting your search filters</p>
          </div>
        ) : (
          <div className="jobs-list">
            {jobs.map((job) => (
              <article key={job.id} className="job-card">
                <div className="job-card-header">
                  <div className="company-logo">
                    {job.company?.charAt(0) || 'J'}
                  </div>
                  <button 
                    className={`save-btn ${savedJobs.has(job.id) ? 'saved' : ''}`}
                    onClick={() => handleSaveJob(job.id)}
                    aria-label={savedJobs.has(job.id) ? 'Unsave job' : 'Save job'}
                  >
                    {savedJobs.has(job.id) ? '❤️' : '🤍'}
                  </button>
                </div>
                
                <div className="job-content">
                  <h2>{job.title}</h2>
                  <div className="company-name">{job.company}</div>
                  
                  <div className="job-details">
                    <span className="job-detail">
                      <span className="icon">📍</span>
                      {job.location}
                    </span>
                    <span className="job-detail">
                      <span className="icon">📁</span>
                      {job.category}
                    </span>
                  </div>
                  
                  <p className="job-description">
                    {job.description?.length > 150 
                      ? `${job.description.substring(0, 150)}...` 
                      : job.description}
                  </p>
                </div>
                
                <div className="job-actions">
                  <button 
                    className="apply-btn"
                    onClick={() => handleApply(job)}
                    disabled={applyingTo === job.id}
                  >
                    {applyingTo === job.id ? 'Applying...' : 'Apply Now'}
                  </button>
                  <button 
                    className="view-btn"
                    onClick={() => navigate(`/job/${job.id}`)}
                  >
                    View Details
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="pagination">
            <button 
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
            >
              ← Previous
            </button>
            
            <div className="page-numbers">
              {[...Array(pagination.totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  className={pagination.currentPage === i + 1 ? 'active' : ''}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            
            <button 
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
            >
              Next →
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Jobs;


