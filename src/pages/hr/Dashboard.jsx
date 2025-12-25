import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { applicationsAPI, jobsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import '../../styles/HRDashboard.css';

const statusOptions = [
  { value: 'pending', label: 'Pending', color: '#f59e0b' },
  { value: 'reviewed', label: 'Reviewed', color: '#3b82f6' },
  { value: 'shortlisted', label: 'Shortlisted', color: '#10b981' },
  { value: 'interview', label: 'Interview', color: '#8b5cf6' },
  { value: 'rejected', label: 'Rejected', color: '#ef4444' },
  { value: 'hired', label: 'Hired', color: '#22c55e' },
];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const { isAuthenticated, isHR, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isHR) {
      navigate('/jobs');
      toast.error('Access denied. HR account required.');
      return;
    }
    fetchData();
  }, [isAuthenticated, isHR, navigate]);

  const fetchData = async () => {
    try {
      const [statsRes, applicantsRes] = await Promise.all([
        applicationsAPI.getStats(),
        applicationsAPI.getApplicants({ status: statusFilter || undefined }),
      ]);
      setStats(statsRes.data);
      setApplicants(applicantsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 404) {
        setApplicants([]);
      }
    }
    setLoading(false);
  };

  const handleStatusChange = async () => {
    if (!selectedApplicant || !newStatus) return;

    setUpdating(true);
    try {
      await applicationsAPI.updateStatus(selectedApplicant.id, {
        status: newStatus,
        notes: notes,
      });
      toast.success('Status updated successfully!');
      setSelectedApplicant(null);
      setNewStatus('');
      setNotes('');
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
    setUpdating(false);
  };

  const handleFilterChange = (status) => {
    setStatusFilter(status);
  };

  useEffect(() => {
    if (!loading) {
      fetchData();
    }
  }, [statusFilter]);

  if (loading) {
    return (
      <div className="hr-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="hr-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>HR Dashboard</h1>
          <p>Welcome back, {user?.name}! Manage your job applications here.</p>
        </div>
        <button className="post-job-btn" onClick={() => navigate('/hr/post-job')}>
          + Post New Job
        </button>
      </div>

      <div className="dashboard-container">
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <span className="stat-number">{stats?.total || 0}</span>
              <span className="stat-label">Total Applications</span>
            </div>
          </div>
          <div className="stat-card pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <span className="stat-number">{stats?.pending || 0}</span>
              <span className="stat-label">Pending Review</span>
            </div>
          </div>
          <div className="stat-card shortlisted">
            <div className="stat-icon">⭐</div>
            <div className="stat-info">
              <span className="stat-number">{stats?.shortlisted || 0}</span>
              <span className="stat-label">Shortlisted</span>
            </div>
          </div>
          <div className="stat-card interview">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <span className="stat-number">{stats?.interview || 0}</span>
              <span className="stat-label">Interview Stage</span>
            </div>
          </div>
          <div className="stat-card hired">
            <div className="stat-icon">🎉</div>
            <div className="stat-info">
              <span className="stat-number">{stats?.hired || 0}</span>
              <span className="stat-label">Hired</span>
            </div>
          </div>
          <div className="stat-card rejected">
            <div className="stat-icon">❌</div>
            <div className="stat-info">
              <span className="stat-number">{stats?.rejected || 0}</span>
              <span className="stat-label">Rejected</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="filter-section">
          <h2>Applicants</h2>
          <div className="filter-tabs">
            <button 
              className={!statusFilter ? 'active' : ''} 
              onClick={() => handleFilterChange('')}
            >
              All
            </button>
            {statusOptions.map(opt => (
              <button
                key={opt.value}
                className={statusFilter === opt.value ? 'active' : ''}
                onClick={() => handleFilterChange(opt.value)}
                style={statusFilter === opt.value ? { background: opt.color } : {}}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Applicants Table */}
        {applicants.length === 0 ? (
          <div className="no-applicants">
            <h3>No applicants found</h3>
            <p>{statusFilter ? `No ${statusFilter} applicants.` : 'No applications received yet.'}</p>
          </div>
        ) : (
          <div className="applicants-table">
            <table>
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Job</th>
                  <th>Applied On</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((applicant) => {
                  const statusOpt = statusOptions.find(s => s.value === (applicant.status || 'pending'));
                  return (
                    <tr key={applicant.id}>
                      <td className="applicant-cell">
                        <div className="applicant-avatar">
                          {applicant.name?.charAt(0) || 'A'}
                        </div>
                        <div className="applicant-info">
                          <span className="name">{applicant.name}</span>
                          <span className="email">{applicant.email}</span>
                        </div>
                      </td>
                      <td>
                        <span className="job-title">{applicant.job_title}</span>
                        <span className="company">{applicant.company}</span>
                      </td>
                      <td>
                        {new Date(applicant.created_on).toLocaleDateString()}
                      </td>
                      <td>
                        <span 
                          className="status-badge"
                          style={{ background: `${statusOpt?.color}20`, color: statusOpt?.color }}
                        >
                          {statusOpt?.label || 'Pending'}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="action-btn"
                          onClick={() => {
                            setSelectedApplicant(applicant);
                            setNewStatus(applicant.status || 'pending');
                            setNotes(applicant.notes || '');
                          }}
                        >
                          Update Status
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {selectedApplicant && (
        <div className="modal-overlay" onClick={() => setSelectedApplicant(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Update Application Status</h2>
              <button className="close-btn" onClick={() => setSelectedApplicant(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="applicant-summary">
                <strong>{selectedApplicant.name}</strong>
                <span>{selectedApplicant.email}</span>
                <span>Applied for: {selectedApplicant.job_title}</span>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                  {statusOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Notes (will be sent to applicant)</label>
                <textarea 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add a note for the applicant..."
                  rows={4}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setSelectedApplicant(null)}>Cancel</button>
              <button className="save-btn" onClick={handleStatusChange} disabled={updating}>
                {updating ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;


