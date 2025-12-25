import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { applicationsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import '../../styles/ApplicationWorkflow.css';

const ApplicationWorkflow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isHR } = useAuth();
  const [workflow, setWorkflow] = useState(null);
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionModal, setActionModal] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (!isAuthenticated || !isHR) {
      navigate('/login');
      return;
    }
    fetchWorkflow();
    fetchStages();
  }, [id, isAuthenticated, isHR, navigate]);

  const fetchWorkflow = async () => {
    try {
      const response = await applicationsAPI.getWorkflow(id);
      setWorkflow(response.data);
    } catch (error) {
      console.error('Error fetching workflow:', error);
      toast.error('Failed to load application workflow');
    } finally {
      setLoading(false);
    }
  };

  const fetchStages = async () => {
    try {
      const response = await applicationsAPI.getWorkflowStages();
      setStages(response.data);
    } catch (error) {
      console.error('Error fetching stages:', error);
    }
  };

  const handleNextStage = async () => {
    try {
      await applicationsAPI.moveToNextStage(id, formData);
      toast.success('Application moved to next stage');
      setActionModal(null);
      setFormData({});
      fetchWorkflow();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to move to next stage');
    }
  };

  const handleReject = async () => {
    if (!formData.rejection_reason?.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    try {
      await applicationsAPI.rejectApplication(id, formData);
      toast.success('Application rejected');
      setActionModal(null);
      setFormData({});
      fetchWorkflow();
      setTimeout(() => navigate('/hr/dashboard'), 2000);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to reject application');
    }
  };

  const handleScheduleInterview = async () => {
    if (!formData.scheduled_date || !formData.scheduled_time) {
      toast.error('Please provide date and time');
      return;
    }
    try {
      await applicationsAPI.scheduleInterview(id, formData);
      toast.success('Interview scheduled successfully');
      setActionModal(null);
      setFormData({});
      fetchWorkflow();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to schedule interview');
    }
  };

  const handleCompleteStage = async () => {
    if (!formData.status) {
      toast.error('Please select status (passed/failed)');
      return;
    }
    try {
      await applicationsAPI.completeStage(id, formData);
      toast.success(`Stage marked as ${formData.status}`);
      setActionModal(null);
      setFormData({});
      fetchWorkflow();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to complete stage');
    }
  };

  const getStageInfo = (stageId) => {
    return stages.find(s => s.id === stageId) || { name: stageId, description: '' };
  };

  const getStageStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      scheduled: '#3b82f6',
      completed: '#10b981',
      passed: '#10b981',
      failed: '#ef4444',
      rejected: '#ef4444',
    };
    return colors[status] || '#64748b';
  };

  if (loading) {
    return (
      <div className="workflow-container">
        <div className="loading-spinner">Loading workflow...</div>
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="workflow-container">
        <div className="error-message">Application not found</div>
      </div>
    );
  }

  const currentStageInfo = getStageInfo(workflow.current_stage);
  const stageHistory = workflow.stages || [];

  return (
    <div className="workflow-container">
      <div className="workflow-header">
        <button className="back-btn" onClick={() => navigate('/hr/dashboard')}>
          ← Back to Dashboard
        </button>
        <div>
          <h1>Application Workflow</h1>
          <p>{workflow.application.name} - {workflow.application.job_title}</p>
        </div>
      </div>

      <div className="workflow-content">
        {/* Application Info */}
        <div className="application-info-card">
          <h3>Applicant Information</h3>
          <div className="info-grid">
            <div>
              <label>Name</label>
              <span>{workflow.application.name}</span>
            </div>
            <div>
              <label>Email</label>
              <span>{workflow.application.email}</span>
            </div>
            <div>
              <label>Job Title</label>
              <span>{workflow.application.job_title}</span>
            </div>
            <div>
              <label>Applied On</label>
              <span>{new Date(workflow.application.created_on).toLocaleDateString()}</span>
            </div>
            <div>
              <label>Current Stage</label>
              <span className="stage-badge" style={{ background: getStageStatusColor(workflow.stage_status) + '20', color: getStageStatusColor(workflow.stage_status) }}>
                {currentStageInfo.name}
              </span>
            </div>
            <div>
              <label>Stage Status</label>
              <span className="status-badge" style={{ background: getStageStatusColor(workflow.stage_status) + '20', color: getStageStatusColor(workflow.stage_status) }}>
                {workflow.stage_status || 'pending'}
              </span>
            </div>
          </div>
        </div>

        {/* Workflow Stages Visualization */}
        <div className="stages-visualization">
          <h3>Workflow Progress</h3>
          <div className="stages-timeline">
            {stages.filter(s => s.id !== 'rejected').map((stage, index) => {
              const stageHistoryItem = stageHistory.find(sh => sh.stage === stage.id);
              const isCurrent = workflow.current_stage === stage.id;
              const isCompleted = stageHistoryItem?.status === 'passed' || stageHistoryItem?.status === 'completed';
              const isRejected = workflow.current_stage === 'rejected';
              const isPast = stages.findIndex(s => s.id === workflow.current_stage) > index;

              return (
                <div key={stage.id} className={`stage-item ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''} ${isPast ? 'past' : ''}`}>
                  <div className="stage-icon">
                    {isCompleted ? '✓' : isCurrent ? '→' : '○'}
                  </div>
                  <div className="stage-content">
                    <h4>{stage.name}</h4>
                    <p>{stage.description}</p>
                    {stageHistoryItem && (
                      <div className="stage-history">
                        <span>Status: {stageHistoryItem.status}</span>
                        {stageHistoryItem.scheduled_date && (
                          <span>Scheduled: {new Date(stageHistoryItem.scheduled_date).toLocaleDateString()}</span>
                        )}
                        {stageHistoryItem.completed_at && (
                          <span>Completed: {new Date(stageHistoryItem.completed_at).toLocaleDateString()}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="workflow-actions">
          <h3>Actions</h3>
          <div className="action-buttons">
            {workflow.current_stage !== 'hired' && workflow.current_stage !== 'rejected' && (
              <>
                <button 
                  className="btn-primary"
                  onClick={() => setActionModal('next-stage')}
                >
                  Move to Next Stage
                </button>
                <button 
                  className="btn-schedule"
                  onClick={() => setActionModal('schedule-interview')}
                >
                  Schedule Interview
                </button>
                <button 
                  className="btn-complete"
                  onClick={() => setActionModal('complete-stage')}
                >
                  Complete Stage
                </button>
                <button 
                  className="btn-reject"
                  onClick={() => setActionModal('reject')}
                >
                  Reject Application
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stage History */}
        {stageHistory.length > 0 && (
          <div className="stage-history-section">
            <h3>Stage History</h3>
            <div className="history-list">
              {stageHistory.map((stage, index) => (
                <div key={index} className="history-item">
                  <div className="history-header">
                    <span className="history-stage">{getStageInfo(stage.stage).name}</span>
                    <span className="history-status" style={{ color: getStageStatusColor(stage.status) }}>
                      {stage.status}
                    </span>
                  </div>
                  {stage.feedback && <p className="history-feedback">{stage.feedback}</p>}
                  {stage.notes && <p className="history-notes">{stage.notes}</p>}
                  {stage.completed_at && (
                    <span className="history-date">
                      {new Date(stage.completed_at).toLocaleString()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Modals */}
      {actionModal === 'next-stage' && (
        <div className="modal-overlay" onClick={() => setActionModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Move to Next Stage</h2>
            <div className="form-group">
              <label>Notes</label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add notes about this stage..."
                rows={4}
              />
            </div>
            <div className="form-group">
              <label>Feedback</label>
              <textarea
                value={formData.feedback || ''}
                onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                placeholder="Add feedback..."
                rows={3}
              />
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => { setActionModal(null); setFormData({}); }}>Cancel</button>
              <button className="btn-primary" onClick={handleNextStage}>Move to Next Stage</button>
            </div>
          </div>
        </div>
      )}

      {actionModal === 'reject' && (
        <div className="modal-overlay" onClick={() => setActionModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Reject Application</h2>
            <div className="form-group">
              <label>Rejection Reason *</label>
              <textarea
                value={formData.rejection_reason || ''}
                onChange={(e) => setFormData({ ...formData, rejection_reason: e.target.value })}
                placeholder="Please provide a reason for rejection..."
                rows={4}
                required
              />
            </div>
            <div className="form-group">
              <label>Additional Notes</label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes..."
                rows={3}
              />
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => { setActionModal(null); setFormData({}); }}>Cancel</button>
              <button className="btn-reject" onClick={handleReject}>Reject Application</button>
            </div>
          </div>
        </div>
      )}

      {actionModal === 'schedule-interview' && (
        <div className="modal-overlay" onClick={() => setActionModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Schedule Interview</h2>
            <div className="form-group">
              <label>Interview Type *</label>
              <select
                value={formData.interview_type || 'video_call'}
                onChange={(e) => setFormData({ ...formData, interview_type: e.target.value })}
              >
                <option value="video_call">Video Call</option>
                <option value="in_person">In Person</option>
                <option value="phone">Phone</option>
                <option value="programming">Programming Interview</option>
                <option value="aptitude">Aptitude Test</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date *</label>
              <input
                type="date"
                value={formData.scheduled_date || ''}
                onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Time *</label>
              <input
                type="time"
                value={formData.scheduled_time || ''}
                onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Interview Link (for video calls)</label>
              <input
                type="url"
                value={formData.interview_link || ''}
                onChange={(e) => setFormData({ ...formData, interview_link: e.target.value })}
                placeholder="https://meet.google.com/..."
              />
            </div>
            <div className="form-group">
              <label>Interviewer Name</label>
              <input
                type="text"
                value={formData.interviewer_name || ''}
                onChange={(e) => setFormData({ ...formData, interviewer_name: e.target.value })}
                placeholder="Interviewer name"
              />
            </div>
            <div className="form-group">
              <label>Interviewer Email</label>
              <input
                type="email"
                value={formData.interviewer_email || ''}
                onChange={(e) => setFormData({ ...formData, interviewer_email: e.target.value })}
                placeholder="interviewer@company.com"
              />
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes..."
                rows={3}
              />
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => { setActionModal(null); setFormData({}); }}>Cancel</button>
              <button className="btn-schedule" onClick={handleScheduleInterview}>Schedule Interview</button>
            </div>
          </div>
        </div>
      )}

      {actionModal === 'complete-stage' && (
        <div className="modal-overlay" onClick={() => setActionModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Complete Stage</h2>
            <div className="form-group">
              <label>Status *</label>
              <select
                value={formData.status || ''}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                required
              >
                <option value="">Select status</option>
                <option value="passed">Passed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div className="form-group">
              <label>Score (optional)</label>
              <input
                type="number"
                value={formData.score || ''}
                onChange={(e) => setFormData({ ...formData, score: parseInt(e.target.value) })}
                placeholder="Score out of 100"
                min="0"
                max="100"
              />
            </div>
            <div className="form-group">
              <label>Feedback</label>
              <textarea
                value={formData.feedback || ''}
                onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                placeholder="Provide feedback..."
                rows={4}
              />
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes..."
                rows={3}
              />
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => { setActionModal(null); setFormData({}); }}>Cancel</button>
              <button className="btn-complete" onClick={handleCompleteStage}>Complete Stage</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationWorkflow;

