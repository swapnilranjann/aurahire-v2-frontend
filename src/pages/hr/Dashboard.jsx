import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { applicationsAPI, jobsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import DonutChart from '../../components/charts/DonutChart';
import BarChart from '../../components/charts/BarChart';
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
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [deletingJobId, setDeletingJobId] = useState(null);

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
      const [statsRes, applicantsRes, jobsRes] = await Promise.all([
        applicationsAPI.getStats(),
        applicationsAPI.getApplicants({ status: statusFilter || undefined }),
        jobsAPI.getMyJobs().catch(() => ({ data: [] })),
      ]);
      setStats(statsRes.data);
      setApplicants(applicantsRes.data);
      setMyJobs(jobsRes.data || []);
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

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return;
    }

    setDeletingJobId(jobId);
    try {
      await jobsAPI.delete(jobId);
      toast.success('Job deleted successfully!');
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error(error.response?.data?.error || 'Failed to delete job');
    } finally {
      setDeletingJobId(null);
    }
  };

  const handleEditJob = (job) => {
    setSelectedJob(job);
  };

  const handleUpdateJob = async () => {
    if (!selectedJob) return;

    setUpdating(true);
    try {
      await jobsAPI.update(selectedJob.id, {
        title: selectedJob.title,
        company: selectedJob.company,
        description: selectedJob.description,
        location: selectedJob.location,
        category: selectedJob.category,
      });
      toast.success('Job updated successfully!');
      setSelectedJob(null);
      fetchData();
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error(error.response?.data?.error || 'Failed to update job');
    } finally {
      setUpdating(false);
    }
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

        {/* Charts Section */}
        {stats && (
          <div className="charts-section">
            <div className="chart-card">
              <h3>Application Status Distribution</h3>
              <DonutChart
                data={[
                  { label: 'Pending', value: stats.pending || 0, color: '#f59e0b' },
                  { label: 'Reviewed', value: stats.reviewed || 0, color: '#3b82f6' },
                  { label: 'Shortlisted', value: stats.shortlisted || 0, color: '#10b981' },
                  { label: 'Interview', value: stats.interview || 0, color: '#8b5cf6' },
                  { label: 'Hired', value: stats.hired || 0, color: '#22c55e' },
                  { label: 'Rejected', value: stats.rejected || 0, color: '#ef4444' },
                ]}
                size={250}
              />
            </div>
            <div className="chart-card">
              <h3>Applications by Status</h3>
              <BarChart
                data={[
                  { label: 'Pending', value: stats.pending || 0, color: '#f59e0b' },
                  { label: 'Reviewed', value: stats.reviewed || 0, color: '#3b82f6' },
                  { label: 'Shortlisted', value: stats.shortlisted || 0, color: '#10b981' },
                  { label: 'Interview', value: stats.interview || 0, color: '#8b5cf6' },
                  { label: 'Hired', value: stats.hired || 0, color: '#22c55e' },
                  { label: 'Rejected', value: stats.rejected || 0, color: '#ef4444' },
                ]}
                height={250}
              />
            </div>
          </div>
        )}

        {/* My Posted Jobs Section */}
        <div className="filter-section">
          <h2>My Posted Jobs</h2>
          {myJobs.length === 0 ? (
            <div className="no-applicants">
              <h3>No jobs posted yet</h3>
              <p>Click "Post New Job" to create your first job posting.</p>
            </div>
          ) : (
            <div className="jobs-list-section">
              <div className="jobs-grid">
                {myJobs.map((job) => (
                  <div key={job.id} className="job-card-item">
                    <div className="job-card-header">
                      <div className="company-logo">
                        {job.company?.charAt(0) || 'J'}
                      </div>
                      <div className="job-card-actions">
                        <button
                          className="edit-btn"
                          onClick={() => handleEditJob(job)}
                          title="Edit Job"
                        >
                          ✏️
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteJob(job.id)}
                          disabled={deletingJobId === job.id}
                          title="Delete Job"
                        >
                          {deletingJobId === job.id ? '⏳' : '🗑️'}
                        </button>
                      </div>
                    </div>
                    <div className="job-card-content">
                      <h3>{job.title}</h3>
                      <p className="company-name">{job.company}</p>
                      <div className="job-meta-info">
                        <span>📍 {job.location}</span>
                        <span>📁 {job.category}</span>
                      </div>
                      <p className="job-description-preview">
                        {job.description?.length > 100 
                          ? `${job.description.substring(0, 100)}...` 
                          : job.description}
                      </p>
                      <div className="job-posted-date">
                        Posted: {new Date(job.created_on).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <button 
                            className="action-btn"
                            onClick={() => navigate(`/hr/applications/${applicant.id}/workflow`)}
                            style={{ background: 'var(--primary-600)', color: 'white' }}
                          >
                            Manage Workflow
                          </button>
                          <button 
                            className="action-btn"
                            onClick={() => {
                              setSelectedApplicant(applicant);
                              setNewStatus(applicant.status || 'pending');
                              setNotes(applicant.notes || '');
                            }}
                          >
                            Quick Update
                          </button>
                        </div>
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

      {/* Edit Job Modal */}
      {selectedJob && (
        <div className="modal-overlay" onClick={() => setSelectedJob(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Job</h2>
              <button className="close-btn" onClick={() => setSelectedJob(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Job Title *</label>
                <input
                  type="text"
                  value={selectedJob.title}
                  onChange={(e) => setSelectedJob({ ...selectedJob, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Company Name *</label>
                <input
                  type="text"
                  value={selectedJob.company}
                  onChange={(e) => setSelectedJob({ ...selectedJob, company: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  value={selectedJob.location}
                  onChange={(e) => setSelectedJob({ ...selectedJob, location: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <input
                  type="text"
                  value={selectedJob.category}
                  onChange={(e) => setSelectedJob({ ...selectedJob, category: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={selectedJob.description}
                  onChange={(e) => setSelectedJob({ ...selectedJob, description: e.target.value })}
                  rows={6}
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setSelectedJob(null)}>Cancel</button>
              <button className="save-btn" onClick={handleUpdateJob} disabled={updating}>
                {updating ? 'Updating...' : 'Update Job'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;


