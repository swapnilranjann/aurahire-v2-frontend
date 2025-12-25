import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { jobsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import '../../styles/HRDashboard.css';

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    category: '',
  });
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const { isAuthenticated, isHR, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isHR) {
      navigate('/hr/dashboard');
      toast.error('Access denied. HR account required.');
      return;
    }
    fetchFilters();
  }, [isAuthenticated, isHR, navigate]);

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
      toast.error('Failed to load job categories and locations');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.company || !formData.description || !formData.location || !formData.category) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await jobsAPI.create({
        ...formData,
        hr_id: user.id,
      });
      toast.success('Job posted successfully!');
      navigate('/hr/dashboard');
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error(error.response?.data?.error || 'Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="hr-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="hr-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Post a New Job</h1>
          <p>Fill in the details below to post a new job opening</p>
        </div>
        <button className="post-job-btn" onClick={() => navigate('/hr/dashboard')}>
          ← Back to Dashboard
        </button>
      </div>

      <div className="dashboard-container">
        <form onSubmit={handleSubmit} className="post-job-form">
          <div className="form-section">
            <h2>Job Information</h2>
            
            <div className="form-group">
              <label htmlFor="title">Job Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Senior Software Engineer"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="company">Company Name *</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g., Google India"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat, i) => (
                    <option key={i} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="location">Location *</label>
                <select
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a location</option>
                  {locations.map((loc, i) => (
                    <option key={i} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Job Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the job role, requirements, responsibilities, and benefits..."
                rows={8}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate('/hr/dashboard')}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="save-btn"
              disabled={loading}
            >
              {loading ? 'Posting Job...' : 'Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;

