import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { applicationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/MyApplications.css';

const statusColors = {
  pending: { bg: '#fef3c7', text: '#92400e', label: 'Pending' },
  reviewed: { bg: '#dbeafe', text: '#1e40af', label: 'Reviewed' },
  shortlisted: { bg: '#d1fae5', text: '#065f46', label: 'Shortlisted' },
  interview: { bg: '#ede9fe', text: '#5b21b6', label: 'Interview' },
  rejected: { bg: '#fee2e2', text: '#991b1b', label: 'Rejected' },
  hired: { bg: '#dcfce7', text: '#166534', label: 'Hired 🎉' },
};

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/my-applications' } } });
      return;
    }
    fetchApplications();
  }, [isAuthenticated, navigate]);

  const fetchApplications = async () => {
    try {
      const response = await applicationsAPI.getMyApplications();
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch applications');
    }
    setLoading(false);
  };

  const handleWithdraw = async (id) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) {
      return;
    }

    try {
      await applicationsAPI.withdrawApplication(id);
      setApplications(applications.filter(app => app.id !== id));
      toast.success('Application withdrawn successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to withdraw application');
    }
  };

  const filteredApplications = filter === 'all' 
    ? applications 
    : applications.filter(app => app.status === filter);

  const getStatusInfo = (status) => {
    return statusColors[status] || statusColors.pending;
  };

  if (loading) {
    return (
      <div className="applications-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="applications-page">
      <div className="applications-header">
        <h1>My Applications</h1>
        <p>Track the status of your job applications</p>
      </div>

      <div className="applications-container">
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{applications.length}</div>
            <div className="stat-label">Total Applications</div>
          </div>
          <div className="stat-card pending">
            <div className="stat-number">
              {applications.filter(a => !a.status || a.status === 'pending').length}
            </div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card shortlisted">
            <div className="stat-number">
              {applications.filter(a => a.status === 'shortlisted' || a.status === 'interview').length}
            </div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="stat-card hired">
            <div className="stat-number">
              {applications.filter(a => a.status === 'hired').length}
            </div>
            <div className="stat-label">Hired</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          {['all', 'pending', 'reviewed', 'shortlisted', 'interview', 'rejected', 'hired'].map(status => (
            <button
              key={status}
              className={filter === status ? 'active' : ''}
              onClick={() => setFilter(status)}
            >
              {status === 'all' ? 'All' : statusColors[status]?.label || status}
            </button>
          ))}
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="no-applications">
            <h3>No applications found</h3>
            <p>
              {filter === 'all' 
                ? "You haven't applied to any jobs yet." 
                : `No ${filter} applications.`}
            </p>
            <button onClick={() => navigate('/jobs')} className="browse-btn">
              Browse Jobs
            </button>
          </div>
        ) : (
          <div className="applications-list">
            {filteredApplications.map((app) => {
              const statusInfo = getStatusInfo(app.status);
              return (
                <div key={app.id} className="application-card">
                  <div className="app-header">
                    <div className="company-logo">
                      {app.company?.charAt(0) || 'J'}
                    </div>
                    <div className="app-info">
                      <h3>{app.title}</h3>
                      <p className="company">{app.company}</p>
                      <p className="location">📍 {app.location}</p>
                    </div>
                    <div 
                      className="status-badge"
                      style={{ 
                        background: statusInfo.bg, 
                        color: statusInfo.text 
                      }}
                    >
                      {statusInfo.label}
                    </div>
                  </div>

                  <div className="app-timeline">
                    <div className="timeline-item active">
                      <div className="timeline-dot"></div>
                      <span>Applied</span>
                      <span className="date">
                        {new Date(app.created_on || app.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className={`timeline-item ${app.status && app.status !== 'pending' ? 'active' : ''}`}>
                      <div className="timeline-dot"></div>
                      <span>Reviewed</span>
                    </div>
                    <div className={`timeline-item ${['shortlisted', 'interview', 'hired'].includes(app.status) ? 'active' : ''}`}>
                      <div className="timeline-dot"></div>
                      <span>Shortlisted</span>
                    </div>
                    <div className={`timeline-item ${app.status === 'hired' ? 'active' : ''}`}>
                      <div className="timeline-dot"></div>
                      <span>Hired</span>
                    </div>
                  </div>

                  {app.notes && (
                    <div className="app-notes">
                      <strong>Note from HR:</strong> {app.notes}
                    </div>
                  )}

                  <div className="app-actions">
                    <button 
                      className="view-job-btn"
                      onClick={() => navigate(`/job/${app.job_id}`)}
                    >
                      View Job
                    </button>
                    {(!app.status || app.status === 'pending') && (
                      <button 
                        className="withdraw-btn"
                        onClick={() => handleWithdraw(app.id)}
                      >
                        Withdraw
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;


