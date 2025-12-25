import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/JobAlerts.css';

const JobAlerts = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    keywords: '',
    location: '',
    category: '',
    experience_level: '',
    salary_range: '',
    job_type: '',
    frequency: 'daily',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/job-alerts' } });
      return;
    }
    fetchAlerts();
  }, [isAuthenticated, navigate]);

  const fetchAlerts = async () => {
    try {
      const response = await api.get('/job-alerts');
      setAlerts(response.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/job-alerts', formData);
      setShowForm(false);
      setFormData({
        keywords: '',
        location: '',
        category: '',
        experience_level: '',
        salary_range: '',
        job_type: '',
        frequency: 'daily',
      });
      fetchAlerts();
      alert('Job alert created successfully!');
    } catch (error) {
      alert('Failed to create alert. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this alert?')) return;
    try {
      await api.delete(`/job-alerts/${id}`);
      fetchAlerts();
    } catch (error) {
      alert('Failed to delete alert.');
    }
  };

  const handleToggle = async (id, currentStatus) => {
    try {
      await api.patch(`/job-alerts/${id}/toggle`);
      fetchAlerts();
    } catch (error) {
      alert('Failed to update alert.');
    }
  };

  if (loading) {
    return <div className="job-alerts-loading">Loading...</div>;
  }

  return (
    <div className="job-alerts-page">
      <div className="job-alerts-container">
        <div className="alerts-header">
          <h1>Job Alerts</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn-create">
            {showForm ? 'Cancel' : '+ Create Alert'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="alert-form">
            <h2>Create New Job Alert</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Keywords</label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  placeholder="e.g., Software Engineer, Developer"
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Bangalore"
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Engineering"
                />
              </div>
              <div className="form-group">
                <label>Experience Level</label>
                <select
                  value={formData.experience_level}
                  onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                >
                  <option value="">Any</option>
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                </select>
              </div>
              <div className="form-group">
                <label>Salary Range</label>
                <input
                  type="text"
                  value={formData.salary_range}
                  onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                  placeholder="e.g., 50000-100000"
                />
              </div>
              <div className="form-group">
                <label>Job Type</label>
                <select
                  value={formData.job_type}
                  onChange={(e) => setFormData({ ...formData, job_type: e.target.value })}
                >
                  <option value="">Any</option>
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="remote">Remote</option>
                </select>
              </div>
              <div className="form-group">
                <label>Alert Frequency</label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="instant">Instant</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn-submit">Create Alert</button>
          </form>
        )}

        <div className="alerts-list">
          {alerts.length === 0 ? (
            <div className="no-alerts">
              <p>No job alerts created yet. Create one to get notified about new job opportunities!</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className={`alert-card ${!alert.is_active ? 'inactive' : ''}`}>
                <div className="alert-info">
                  <h3>
                    {alert.keywords || 'All Jobs'}
                    {alert.location && ` in ${alert.location}`}
                  </h3>
                  <div className="alert-details">
                    {alert.category && <span>📁 {alert.category}</span>}
                    {alert.experience_level && <span>💼 {alert.experience_level}</span>}
                    {alert.salary_range && <span>💰 {alert.salary_range}</span>}
                    <span>📧 {alert.frequency}</span>
                  </div>
                </div>
                <div className="alert-actions">
                  <button
                    onClick={() => handleToggle(alert.id, alert.is_active)}
                    className={`btn-toggle ${alert.is_active ? 'active' : ''}`}
                  >
                    {alert.is_active ? '✓ Active' : '○ Inactive'}
                  </button>
                  <button onClick={() => handleDelete(alert.id)} className="btn-delete">
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default JobAlerts;

