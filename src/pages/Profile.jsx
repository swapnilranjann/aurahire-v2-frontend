import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { profileAPI, uploadAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);
  const [tips, setTips] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    headline: '',
    summary: '',
    currentLocation: '',
    expectedSalary: '',
    noticePeriod: '',
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    isOpenToWork: true,
  });

  const [newExperience, setNewExperience] = useState({
    company: '', title: '', location: '', startDate: '', endDate: '', current: false, description: ''
  });
  const [newEducation, setNewEducation] = useState({
    institution: '', degree: '', field: '', startDate: '', endDate: '', grade: ''
  });
  const [newSkill, setNewSkill] = useState('');

  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/profile' } } });
      return;
    }
    fetchProfile();
    fetchTips();
  }, [isAuthenticated, navigate]);

  const fetchProfile = async () => {
    try {
      const response = await profileAPI.get();
      setProfile(response.data);
      setFormData({
        name: response.data.name || user?.name || '',
        phone: response.data.phone || '',
        headline: response.data.headline || '',
        summary: response.data.summary || '',
        currentLocation: response.data.currentLocation || '',
        expectedSalary: response.data.expectedSalary || '',
        noticePeriod: response.data.noticePeriod || '',
        linkedinUrl: response.data.linkedinUrl || '',
        githubUrl: response.data.githubUrl || '',
        portfolioUrl: response.data.portfolioUrl || '',
        isOpenToWork: response.data.isOpenToWork !== false,
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
    setLoading(false);
  };

  const fetchTips = async () => {
    try {
      const response = await profileAPI.getCompletionTips();
      setTips(response.data.tips || []);
    } catch (error) {
      console.error('Error fetching tips:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await profileAPI.update(formData);
      toast.success('Profile updated successfully!');
      setEditMode(false);
      fetchProfile();
      fetchTips();
    } catch (error) {
      toast.error('Failed to update profile');
    }
    setSaving(false);
  };

  const handleAddExperience = async (e) => {
    e.preventDefault();
    try {
      await profileAPI.addExperience(newExperience);
      toast.success('Experience added!');
      setNewExperience({ company: '', title: '', location: '', startDate: '', endDate: '', current: false, description: '' });
      fetchProfile();
      fetchTips();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add experience');
    }
  };

  const handleDeleteExperience = async (id) => {
    try {
      await profileAPI.deleteExperience(id);
      toast.success('Experience deleted');
      fetchProfile();
    } catch (error) {
      toast.error('Failed to delete experience');
    }
  };

  const handleAddEducation = async (e) => {
    e.preventDefault();
    try {
      await profileAPI.addEducation(newEducation);
      toast.success('Education added!');
      setNewEducation({ institution: '', degree: '', field: '', startDate: '', endDate: '', grade: '' });
      fetchProfile();
      fetchTips();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add education');
    }
  };

  const handleDeleteEducation = async (id) => {
    try {
      await profileAPI.deleteEducation(id);
      toast.success('Education deleted');
      fetchProfile();
    } catch (error) {
      toast.error('Failed to delete education');
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;
    const skills = [...(profile?.skills || []), newSkill.trim()];
    try {
      await profileAPI.updateSkills(skills);
      toast.success('Skill added!');
      setNewSkill('');
      fetchProfile();
      fetchTips();
    } catch (error) {
      toast.error('Failed to add skill');
    }
  };

  const handleRemoveSkill = async (skillToRemove) => {
    const skills = (profile?.skills || []).filter(s => s !== skillToRemove);
    try {
      await profileAPI.updateSkills(skills);
      fetchProfile();
    } catch (error) {
      toast.error('Failed to remove skill');
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const response = await uploadAPI.uploadPhoto(file);
      await profileAPI.update({ photo: response.data.url });
      toast.success('Photo uploaded!');
      fetchProfile();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to upload photo');
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const response = await uploadAPI.uploadResume(file);
      await profileAPI.update({ resume: response.data.url });
      toast.success('Resume uploaded!');
      fetchProfile();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to upload resume');
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-header-content">
          <div className="profile-photo-section">
            <div className="profile-photo">
              {profile?.photo ? (
                <img src={`http://localhost:15000${profile.photo}`} alt="Profile" />
              ) : (
                <span>{formData.name?.charAt(0) || user?.name?.charAt(0) || 'U'}</span>
              )}
              <label className="photo-upload-btn">
                📷
                <input type="file" accept="image/*" onChange={handlePhotoUpload} hidden />
              </label>
            </div>
          </div>
          
          <div className="profile-info">
            <h1>{formData.name || user?.name}</h1>
            <p className="headline">{formData.headline || 'Add a headline'}</p>
            <p className="location">📍 {formData.currentLocation || 'Add location'}</p>
            {formData.isOpenToWork && (
              <span className="open-to-work">🟢 Open to work</span>
            )}
          </div>

          <div className="profile-completion">
            <div className="completion-circle">
              <svg viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#667eea"
                  strokeWidth="3"
                  strokeDasharray={`${profile?.completionPercentage || 0}, 100`}
                />
              </svg>
              <span>{profile?.completionPercentage || 0}%</span>
            </div>
            <p>Profile Complete</p>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="profile-container">
        <div className="profile-tabs">
          {['overview', 'experience', 'education', 'skills'].map(tab => (
            <button
              key={tab}
              className={activeTab === tab ? 'active' : ''}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tips */}
        {tips.length > 0 && (
          <div className="profile-tips">
            <h3>💡 Complete your profile</h3>
            <div className="tips-list">
              {tips.slice(0, 3).map((tip, i) => (
                <div key={i} className="tip-item">
                  <span className="tip-field">{tip.field}</span>
                  <span className="tip-text">{tip.tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              {editMode ? (
                <div className="edit-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input name="name" value={formData.name} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91 12345 67890" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Headline</label>
                    <input name="headline" value={formData.headline} onChange={handleInputChange} placeholder="e.g., Senior Software Engineer at Google" />
                  </div>
                  <div className="form-group">
                    <label>Summary</label>
                    <textarea name="summary" value={formData.summary} onChange={handleInputChange} rows={4} placeholder="Tell us about yourself..." />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Current Location</label>
                      <input name="currentLocation" value={formData.currentLocation} onChange={handleInputChange} placeholder="e.g., Bangalore, India" />
                    </div>
                    <div className="form-group">
                      <label>Expected Salary</label>
                      <input name="expectedSalary" value={formData.expectedSalary} onChange={handleInputChange} placeholder="e.g., ₹15-20 LPA" />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Notice Period</label>
                      <input name="noticePeriod" value={formData.noticePeriod} onChange={handleInputChange} placeholder="e.g., 30 days" />
                    </div>
                    <div className="form-group">
                      <label>LinkedIn URL</label>
                      <input name="linkedinUrl" value={formData.linkedinUrl} onChange={handleInputChange} placeholder="https://linkedin.com/in/..." />
                    </div>
                  </div>
                  <div className="form-group checkbox">
                    <label>
                      <input type="checkbox" name="isOpenToWork" checked={formData.isOpenToWork} onChange={handleInputChange} />
                      <span>I'm open to work</span>
                    </label>
                  </div>
                  <div className="form-actions">
                    <button className="save-btn" onClick={handleSaveProfile} disabled={saving}>
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button className="cancel-btn" onClick={() => setEditMode(false)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="overview-content">
                  <div className="section-header">
                    <h2>About</h2>
                    <button onClick={() => setEditMode(true)}>✏️ Edit</button>
                  </div>
                  <p className="summary">{formData.summary || 'No summary added yet. Tell employers about yourself!'}</p>
                  
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="label">Email</span>
                      <span className="value">{user?.email}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Phone</span>
                      <span className="value">{formData.phone || 'Not added'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Expected Salary</span>
                      <span className="value">{formData.expectedSalary || 'Not specified'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Notice Period</span>
                      <span className="value">{formData.noticePeriod || 'Not specified'}</span>
                    </div>
                  </div>

                  <div className="resume-section">
                    <h3>Resume</h3>
                    {profile?.resume ? (
                      <a href={`http://localhost:15000${profile.resume}`} target="_blank" rel="noopener noreferrer" className="resume-link">
                        📄 View Resume
                      </a>
                    ) : (
                      <p>No resume uploaded</p>
                    )}
                    <label className="upload-btn">
                      📤 Upload Resume
                      <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} hidden />
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="experience-tab">
              <h2>Work Experience</h2>
              
              {(profile?.experience || []).map((exp) => (
                <div key={exp.id} className="experience-card">
                  <div className="exp-header">
                    <div>
                      <h3>{exp.title}</h3>
                      <p className="company">{exp.company}</p>
                      <p className="meta">
                        {exp.location} • {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </p>
                    </div>
                    <button onClick={() => handleDeleteExperience(exp.id)} className="delete-btn">🗑️</button>
                  </div>
                  {exp.description && <p className="description">{exp.description}</p>}
                </div>
              ))}

              <form onSubmit={handleAddExperience} className="add-form">
                <h3>Add Experience</h3>
                <div className="form-row">
                  <input placeholder="Job Title *" value={newExperience.title} onChange={(e) => setNewExperience({...newExperience, title: e.target.value})} required />
                  <input placeholder="Company *" value={newExperience.company} onChange={(e) => setNewExperience({...newExperience, company: e.target.value})} required />
                </div>
                <div className="form-row">
                  <input placeholder="Location" value={newExperience.location} onChange={(e) => setNewExperience({...newExperience, location: e.target.value})} />
                  <input type="date" placeholder="Start Date *" value={newExperience.startDate} onChange={(e) => setNewExperience({...newExperience, startDate: e.target.value})} required />
                </div>
                <div className="form-row">
                  <label className="checkbox-label">
                    <input type="checkbox" checked={newExperience.current} onChange={(e) => setNewExperience({...newExperience, current: e.target.checked})} />
                    Currently working here
                  </label>
                  {!newExperience.current && (
                    <input type="date" placeholder="End Date" value={newExperience.endDate} onChange={(e) => setNewExperience({...newExperience, endDate: e.target.value})} />
                  )}
                </div>
                <textarea placeholder="Description" value={newExperience.description} onChange={(e) => setNewExperience({...newExperience, description: e.target.value})} rows={3} />
                <button type="submit" className="add-btn">+ Add Experience</button>
              </form>
            </div>
          )}

          {activeTab === 'education' && (
            <div className="education-tab">
              <h2>Education</h2>
              
              {(profile?.education || []).map((edu) => (
                <div key={edu.id} className="education-card">
                  <div className="edu-header">
                    <div>
                      <h3>{edu.degree} in {edu.field}</h3>
                      <p className="institution">{edu.institution}</p>
                      <p className="meta">{edu.startDate} - {edu.endDate} {edu.grade && `• Grade: ${edu.grade}`}</p>
                    </div>
                    <button onClick={() => handleDeleteEducation(edu.id)} className="delete-btn">🗑️</button>
                  </div>
                </div>
              ))}

              <form onSubmit={handleAddEducation} className="add-form">
                <h3>Add Education</h3>
                <input placeholder="Institution *" value={newEducation.institution} onChange={(e) => setNewEducation({...newEducation, institution: e.target.value})} required />
                <div className="form-row">
                  <input placeholder="Degree *" value={newEducation.degree} onChange={(e) => setNewEducation({...newEducation, degree: e.target.value})} required />
                  <input placeholder="Field of Study *" value={newEducation.field} onChange={(e) => setNewEducation({...newEducation, field: e.target.value})} required />
                </div>
                <div className="form-row">
                  <input type="date" placeholder="Start Date" value={newEducation.startDate} onChange={(e) => setNewEducation({...newEducation, startDate: e.target.value})} />
                  <input type="date" placeholder="End Date" value={newEducation.endDate} onChange={(e) => setNewEducation({...newEducation, endDate: e.target.value})} />
                </div>
                <input placeholder="Grade/CGPA" value={newEducation.grade} onChange={(e) => setNewEducation({...newEducation, grade: e.target.value})} />
                <button type="submit" className="add-btn">+ Add Education</button>
              </form>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="skills-tab">
              <h2>Skills</h2>
              
              <div className="skills-list">
                {(profile?.skills || []).map((skill, i) => (
                  <span key={i} className="skill-tag">
                    {skill}
                    <button onClick={() => handleRemoveSkill(skill)}>×</button>
                  </span>
                ))}
              </div>

              <div className="add-skill-form">
                <input 
                  placeholder="Add a skill (e.g., React, Python, AWS)" 
                  value={newSkill} 
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                />
                <button onClick={handleAddSkill} className="add-btn">+ Add</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;


