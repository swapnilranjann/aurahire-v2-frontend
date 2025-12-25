import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { applicationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/MyApplicationDetail.css';

const MyApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [workflow, setWorkflow] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchWorkflow();
  }, [id, isAuthenticated, navigate]);

  const fetchWorkflow = async () => {
    try {
      const response = await applicationsAPI.getMyApplicationWorkflow(id);
      setWorkflow(response.data);
    } catch (error) {
      console.error('Error fetching workflow:', error);
      toast.error('Failed to load application details');
    } finally {
      setLoading(false);
    }
  };

  const getStageInfo = (stageId) => {
    const stageNames = {
      application_check: 'Application Check',
      interview_round_1: 'Interview Round 1',
      interview_round_2: 'Interview Round 2',
      interview_round_3: 'Interview Round 3',
      aptitude_test: 'Aptitude Test',
      video_call_interview: 'Video Call Interview',
      programming_interview: 'Programming Interview',
      release_letter_round: 'Release Letter Round',
      hired: 'Hired',
      rejected: 'Rejected',
    };
    return stageNames[stageId] || stageId;
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
      <div className="application-detail-page">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="application-detail-page">
        <div className="error-message">Application not found</div>
      </div>
    );
  }

  const stages = [
    { id: 'application_check', name: 'Application Check' },
    { id: 'interview_round_1', name: 'Interview Round 1' },
    { id: 'interview_round_2', name: 'Interview Round 2' },
    { id: 'interview_round_3', name: 'Interview Round 3' },
    { id: 'aptitude_test', name: 'Aptitude Test' },
    { id: 'video_call_interview', name: 'Video Call Interview' },
    { id: 'programming_interview', name: 'Programming Interview' },
    { id: 'release_letter_round', name: 'Release Letter Round' },
    { id: 'hired', name: 'Hired' },
  ];

  const currentStageIndex = stages.findIndex(s => s.id === workflow.current_stage);

  return (
    <div className="application-detail-page">
      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate('/my-applications')}>
          ← Back to Applications
        </button>
        <div>
          <h1>Application Status</h1>
          <p>{workflow.application.job_title} at {workflow.application.company}</p>
        </div>
      </div>

      <div className="detail-content">
        {/* Application Info */}
        <div className="info-card">
          <h3>Application Details</h3>
          <div className="info-grid">
            <div>
              <label>Applied On</label>
              <span>{new Date(workflow.application.created_on).toLocaleDateString()}</span>
            </div>
            <div>
              <label>Current Stage</label>
              <span className="stage-badge" style={{ 
                background: getStageStatusColor(workflow.stage_status) + '20', 
                color: getStageStatusColor(workflow.stage_status) 
              }}>
                {getStageInfo(workflow.current_stage)}
              </span>
            </div>
            <div>
              <label>Status</label>
              <span className="status-badge" style={{ 
                background: getStageStatusColor(workflow.stage_status) + '20', 
                color: getStageStatusColor(workflow.stage_status) 
              }}>
                {workflow.stage_status || 'pending'}
              </span>
            </div>
          </div>
        </div>

        {/* Workflow Timeline */}
        <div className="workflow-timeline-card">
          <h3>Application Progress</h3>
          <div className="timeline">
            {stages.map((stage, index) => {
              const stageHistory = workflow.stages?.find(s => s.stage === stage.id);
              const isCurrent = workflow.current_stage === stage.id;
              const isCompleted = stageHistory?.status === 'passed' || stageHistory?.status === 'completed';
              const isPast = currentStageIndex > index;
              const isRejected = workflow.current_stage === 'rejected' && index <= currentStageIndex;

              return (
                <div key={stage.id} className={`timeline-item ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''} ${isPast ? 'past' : ''} ${isRejected ? 'rejected' : ''}`}>
                  <div className="timeline-marker">
                    {isCompleted ? '✓' : isCurrent ? '→' : isRejected ? '✗' : '○'}
                  </div>
                  <div className="timeline-content">
                    <h4>{stage.name}</h4>
                    {stageHistory && (
                      <div className="timeline-details">
                        {stageHistory.scheduled_date && (
                          <p>📅 Scheduled: {new Date(stageHistory.scheduled_date).toLocaleDateString()}</p>
                        )}
                        {stageHistory.completed_at && (
                          <p>✅ Completed: {new Date(stageHistory.completed_at).toLocaleDateString()}</p>
                        )}
                        {stageHistory.feedback && (
                          <p className="feedback">💬 {stageHistory.feedback}</p>
                        )}
                        {stageHistory.score && (
                          <p>📊 Score: {stageHistory.score}/100</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stage History */}
        {workflow.stages && workflow.stages.length > 0 && (
          <div className="history-card">
            <h3>Stage History</h3>
            <div className="history-list">
              {workflow.stages.map((stage, index) => (
                <div key={index} className="history-item">
                  <div className="history-header">
                    <span className="history-stage">{getStageInfo(stage.stage)}</span>
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
    </div>
  );
};

export default MyApplicationDetail;

