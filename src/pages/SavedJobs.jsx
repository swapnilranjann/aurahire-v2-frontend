import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { savedJobsAPI, jobsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/Jobs.css';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingTo, setApplyingTo] = useState(null);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/saved-jobs' } } });
      return;
    }
    fetchSavedJobs();
  }, [isAuthenticated, navigate]);

  const fetchSavedJobs = async () => {
    try {
      const response = await savedJobsAPI.getAll();
      setSavedJobs(response.data);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      toast.error('Failed to fetch saved jobs');
    }
    setLoading(false);
  };

  const handleUnsave = async (jobId) => {
    try {
      await savedJobsAPI.unsave(jobId);
      setSavedJobs(savedJobs.filter(job => job.id !== jobId));
      toast.success('Job removed from saved');
    } catch (error) {
      toast.error('Failed to remove job');
    }
  };

  const handleApply = async (job) => {
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

  if (loading) {
    return (
      <div className="jobs-page">
        <div className="jobs-loading" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div className="loading-spinner"></div>
          <p>Loading saved jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="jobs-page">
      <section className="jobs-hero" style={{ padding: '48px 24px' }}>
        <div className="hero-content">
          <h1>❤️ Saved Jobs</h1>
          <p>Your bookmarked opportunities</p>
        </div>
      </section>

      <section className="jobs-section">
        <div className="jobs-header">
          <div className="jobs-count">
            You have <strong>{savedJobs.length}</strong> saved jobs
          </div>
        </div>

        {savedJobs.length === 0 ? (
          <div className="no-jobs">
            <h3>No saved jobs yet</h3>
            <p>Browse jobs and click the heart icon to save them here</p>
            <button 
              onClick={() => navigate('/jobs')} 
              style={{
                marginTop: '20px',
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Browse Jobs
            </button>
          </div>
        ) : (
          <div className="jobs-list">
            {savedJobs.map((job) => (
              <article key={job.saved_id || job.id} className="job-card">
                <div className="job-card-header">
                  <div className="company-logo">
                    {job.company?.charAt(0) || 'J'}
                  </div>
                  <button 
                    className="save-btn saved"
                    onClick={() => handleUnsave(job.id)}
                    aria-label="Remove from saved"
                  >
                    ❤️
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

                  {job.saved_at && (
                    <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>
                      Saved on {new Date(job.saved_at).toLocaleDateString()}
                    </p>
                  )}
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
      </section>
    </div>
  );
};

export default SavedJobs;


