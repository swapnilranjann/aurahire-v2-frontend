import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import '../styles/JobDetails.css';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [shareMessage, setShareMessage] = useState('');

  useEffect(() => {
    fetchJobDetails();
    if (isAuthenticated) {
      checkIfApplied();
      checkIfSaved();
    }
  }, [id, isAuthenticated]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/job/${id}`);
      setJob(response.data);
    } catch (err) {
      setError('Failed to load job details. Please try again.');
      console.error('Error fetching job:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkIfApplied = async () => {
    try {
      const response = await api.get('/applications/my-applications');
      const hasApplied = response.data.some(app => app.job_id === parseInt(id));
      setApplied(hasApplied);
    } catch (err) {
      console.error('Error checking application status:', err);
    }
  };

  const checkIfSaved = async () => {
    try {
      const response = await api.get('/saved-jobs');
      const isSaved = response.data.some(savedJob => savedJob.id === parseInt(id));
      setSaved(isSaved);
    } catch (err) {
      console.error('Error checking saved status:', err);
    }
  };

  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/job/${id}` } });
      return;
    }

    try {
      setApplying(true);
      await api.post('/apply', {
        job_id: parseInt(id),
        user_id: user.id,
        email: user.email,
        name: user.name
      });
      setApplied(true);
      alert('Application submitted successfully!');
    } catch (err) {
      if (err.response?.data?.error?.includes('already applied')) {
        setApplied(true);
        alert('You have already applied to this job.');
      } else {
        alert(err.response?.data?.error || 'Failed to apply. Please try again.');
      }
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/job/${id}` } });
      return;
    }

    try {
      setSaving(true);
      if (saved) {
        await api.delete(`/saved-jobs/${id}`);
        setSaved(false);
      } else {
        await api.post('/saved-jobs', { job_id: parseInt(id) });
        setSaved(true);
      }
    } catch (err) {
      console.error('Error saving job:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async () => {
    const jobUrl = window.location.href;
    const shareText = `Check out this job: ${job?.title} at ${job?.company} - ${jobUrl}`;

    // Try Web Share API first (mobile devices)
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${job?.title} at ${job?.company}`,
          text: shareText,
          url: jobUrl,
        });
        setShareMessage('Shared successfully!');
        setTimeout(() => setShareMessage(''), 3000);
        return;
      } catch (err) {
        // User cancelled or error occurred, fall through to clipboard
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    }

    // Fallback to clipboard
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(jobUrl);
        setShareMessage('Link copied to clipboard!');
        setTimeout(() => setShareMessage(''), 3000);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = jobUrl;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          setShareMessage('Link copied to clipboard!');
          setTimeout(() => setShareMessage(''), 3000);
        } catch (err) {
          setShareMessage('Failed to copy. Please copy manually: ' + jobUrl);
          setTimeout(() => setShareMessage(''), 5000);
        }
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error('Error copying to clipboard:', err);
      setShareMessage('Failed to copy. URL: ' + jobUrl);
      setTimeout(() => setShareMessage(''), 5000);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="job-details-loading">
        <div className="spinner"></div>
        <p>Loading job details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="job-details-error">
        <div className="error-icon">⚠️</div>
        <h2>Job Not Found</h2>
        <p>{error || 'This job posting may have been removed or does not exist.'}</p>
        <Link to="/jobs" className="back-to-jobs">Browse All Jobs</Link>
      </div>
    );
  }

  return (
    <div className="job-details-page">
      <div className="job-details-container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/home">Home</Link>
          <span>/</span>
          <Link to="/jobs">Jobs</Link>
          <span>/</span>
          <span className="current">{job.title}</span>
        </nav>

        {/* Job Header */}
        <div className="job-header">
          <div className="job-company-logo">
            {job.company?.charAt(0) || 'C'}
          </div>
          <div className="job-header-info">
            <h1 className="job-title">{job.title}</h1>
            <div className="job-company-name">{job.company}</div>
            <div className="job-meta">
              <span className="meta-item">
                <i className="icon-location">📍</i>
                {job.location}
              </span>
              <span className="meta-item">
                <i className="icon-category">💼</i>
                {job.category}
              </span>
              <span className="meta-item">
                <i className="icon-time">🕐</i>
                Posted {formatDate(job.created_on)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="job-actions">
          <button 
            className={`btn-apply ${applied ? 'applied' : ''}`}
            onClick={handleApply}
            disabled={applying || applied}
          >
            {applied ? '✓ Applied' : applying ? 'Applying...' : 'Apply Now'}
          </button>
          <button 
            className={`btn-save ${saved ? 'saved' : ''}`}
            onClick={handleSave}
            disabled={saving}
          >
            {saved ? '♥ Saved' : saving ? '...' : '♡ Save Job'}
          </button>
          <button className="btn-share" onClick={handleShare}>
            📤 Share
          </button>
        </div>

        {/* Share Message */}
        {shareMessage && (
          <div className="share-message">
            {shareMessage}
          </div>
        )}

        {/* Job Description */}
        <div className="job-content">
          <section className="job-section">
            <h2>Job Description</h2>
            <div className="job-description">
              {job.description?.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              )) || <p>No description available.</p>}
            </div>
          </section>

          <section className="job-section">
            <h2>Job Details</h2>
            <div className="job-details-grid">
              <div className="detail-item">
                <span className="label">Company</span>
                <span className="value">{job.company}</span>
              </div>
              <div className="detail-item">
                <span className="label">Location</span>
                <span className="value">{job.location}</span>
              </div>
              <div className="detail-item">
                <span className="label">Category</span>
                <span className="value">{job.category}</span>
              </div>
              <div className="detail-item">
                <span className="label">Posted Date</span>
                <span className="value">{formatDate(job.created_on)}</span>
              </div>
            </div>
          </section>
        </div>

        {/* Similar Jobs CTA */}
        <div className="similar-jobs-cta">
          <h3>Looking for more opportunities?</h3>
          <p>Browse all available positions and find your perfect match.</p>
          <Link to="/jobs" className="btn-browse">Browse All Jobs</Link>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;

