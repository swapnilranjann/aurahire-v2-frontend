import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/ResumeBuilder.css';

const ResumeBuilder = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resume, setResume] = useState({
    name: '',
    email: '',
    phone: '',
    headline: '',
    summary: '',
    currentLocation: '',
    preferredLocations: [],
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    expectedSalary: '',
    noticePeriod: '',
    jobType: '',
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    isProfilePublic: true,
    isOpenToWork: true,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/resume-builder' } });
      return;
    }
    fetchResume();
  }, [isAuthenticated, navigate]);

  const fetchResume = async () => {
    try {
      const response = await api.get('/resume');
      if (response.data) {
        setResume({
          ...resume,
          ...response.data,
          preferredLocations: response.data.preferredLocations || [],
          experience: response.data.experience || [],
          education: response.data.education || [],
          skills: response.data.skills || [],
          certifications: response.data.certifications || [],
        });
      }
    } catch (error) {
      console.error('Error fetching resume:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setResume({ ...resume, [field]: value });
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...resume[field]];
    newArray[index] = { ...newArray[index], ...value };
    setResume({ ...resume, [field]: newArray });
  };

  const addArrayItem = (field, template) => {
    setResume({ ...resume, [field]: [...resume[field], template] });
  };

  const removeArrayItem = (field, index) => {
    const newArray = resume[field].filter((_, i) => i !== index);
    setResume({ ...resume, [field]: newArray });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.put('/resume', resume);
      alert('Resume saved successfully!');
    } catch (error) {
      alert('Failed to save resume. Please try again.');
      console.error('Error saving resume:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await api.get('/resume/download');
      alert('Resume download feature coming soon!');
    } catch (error) {
      console.error('Error downloading resume:', error);
    }
  };

  if (loading) {
    return <div className="resume-builder-loading">Loading...</div>;
  }

  return (
    <div className="resume-builder-page">
      <div className="resume-builder-container">
        <div className="resume-header">
          <h1>Create Your Resume</h1>
          <div className="resume-actions">
            <button onClick={handleSave} disabled={saving} className="btn-save">
              {saving ? 'Saving...' : '💾 Save Resume'}
            </button>
            <button onClick={handleDownload} className="btn-download">
              📥 Download PDF
            </button>
          </div>
        </div>

        <div className="resume-sections">
          {/* Personal Information */}
          <section className="resume-section">
            <h2>Personal Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={resume.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={resume.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="john@example.com"
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={resume.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+91 9876543210"
                />
              </div>
              <div className="form-group">
                <label>Current Location</label>
                <input
                  type="text"
                  value={resume.currentLocation}
                  onChange={(e) => handleInputChange('currentLocation', e.target.value)}
                  placeholder="Bangalore, India"
                />
              </div>
            </div>
          </section>

          {/* Professional Summary */}
          <section className="resume-section">
            <h2>Professional Summary</h2>
            <div className="form-group">
              <label>Headline</label>
              <input
                type="text"
                value={resume.headline}
                onChange={(e) => handleInputChange('headline', e.target.value)}
                placeholder="Senior Software Engineer"
              />
            </div>
            <div className="form-group">
              <label>Summary</label>
              <textarea
                rows="5"
                value={resume.summary}
                onChange={(e) => handleInputChange('summary', e.target.value)}
                placeholder="Write a brief summary of your professional background..."
              />
            </div>
          </section>

          {/* Work Experience */}
          <section className="resume-section">
            <h2>Work Experience</h2>
            {resume.experience.map((exp, index) => (
              <div key={index} className="array-item">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Company</label>
                    <input
                      type="text"
                      value={exp.company || ''}
                      onChange={(e) => handleArrayChange('experience', index, { company: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Job Title</label>
                    <input
                      type="text"
                      value={exp.title || ''}
                      onChange={(e) => handleArrayChange('experience', index, { title: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Start Date</label>
                    <input
                      type="date"
                      value={exp.startDate || ''}
                      onChange={(e) => handleArrayChange('experience', index, { startDate: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>End Date</label>
                    <input
                      type="date"
                      value={exp.endDate || ''}
                      onChange={(e) => handleArrayChange('experience', index, { endDate: e.target.value })}
                      disabled={exp.current}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={exp.current || false}
                      onChange={(e) => handleArrayChange('experience', index, { current: e.target.checked })}
                    />
                    Currently working here
                  </label>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    rows="3"
                    value={exp.description || ''}
                    onChange={(e) => handleArrayChange('experience', index, { description: e.target.value })}
                  />
                </div>
                <button onClick={() => removeArrayItem('experience', index)} className="btn-remove">
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={() => addArrayItem('experience', { company: '', title: '', startDate: '', endDate: '', current: false, description: '' })}
              className="btn-add"
            >
              + Add Experience
            </button>
          </section>

          {/* Education */}
          <section className="resume-section">
            <h2>Education</h2>
            {resume.education.map((edu, index) => (
              <div key={index} className="array-item">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Institution</label>
                    <input
                      type="text"
                      value={edu.institution || ''}
                      onChange={(e) => handleArrayChange('education', index, { institution: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Degree</label>
                    <input
                      type="text"
                      value={edu.degree || ''}
                      onChange={(e) => handleArrayChange('education', index, { degree: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Field of Study</label>
                    <input
                      type="text"
                      value={edu.field || ''}
                      onChange={(e) => handleArrayChange('education', index, { field: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Year</label>
                    <input
                      type="text"
                      value={edu.endDate || ''}
                      onChange={(e) => handleArrayChange('education', index, { endDate: e.target.value })}
                      placeholder="2020"
                    />
                  </div>
                </div>
                <button onClick={() => removeArrayItem('education', index)} className="btn-remove">
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={() => addArrayItem('education', { institution: '', degree: '', field: '', endDate: '' })}
              className="btn-add"
            >
              + Add Education
            </button>
          </section>

          {/* Skills */}
          <section className="resume-section">
            <h2>Skills</h2>
            <div className="form-group">
              <label>Add Skills (comma-separated)</label>
              <input
                type="text"
                placeholder="JavaScript, React, Node.js, Python"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const skills = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                    setResume({ ...resume, skills: [...resume.skills, ...skills] });
                    e.target.value = '';
                  }
                }}
              />
            </div>
            <div className="skills-list">
              {resume.skills.map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                  <button onClick={() => removeArrayItem('skills', index)}>×</button>
                </span>
              ))}
            </div>
          </section>

          {/* Job Preferences */}
          <section className="resume-section">
            <h2>Job Preferences</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Expected Salary</label>
                <input
                  type="text"
                  value={resume.expectedSalary}
                  onChange={(e) => handleInputChange('expectedSalary', e.target.value)}
                  placeholder="₹10,00,000"
                />
              </div>
              <div className="form-group">
                <label>Notice Period</label>
                <select
                  value={resume.noticePeriod}
                  onChange={(e) => handleInputChange('noticePeriod', e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="immediate">Immediate</option>
                  <option value="1 week">1 Week</option>
                  <option value="2 weeks">2 Weeks</option>
                  <option value="1 month">1 Month</option>
                  <option value="2 months">2 Months</option>
                </select>
              </div>
              <div className="form-group">
                <label>Job Type</label>
                <select
                  value={resume.jobType}
                  onChange={(e) => handleInputChange('jobType', e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="remote">Remote</option>
                </select>
              </div>
            </div>
          </section>

          {/* Social Links */}
          <section className="resume-section">
            <h2>Social Links</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>LinkedIn</label>
                <input
                  type="url"
                  value={resume.linkedinUrl}
                  onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
              <div className="form-group">
                <label>GitHub</label>
                <input
                  type="url"
                  value={resume.githubUrl}
                  onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                  placeholder="https://github.com/yourusername"
                />
              </div>
              <div className="form-group">
                <label>Portfolio</label>
                <input
                  type="url"
                  value={resume.portfolioUrl}
                  onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
                  placeholder="https://yourportfolio.com"
                />
              </div>
            </div>
          </section>

          {/* Visibility Settings */}
          <section className="resume-section">
            <h2>Visibility Settings</h2>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={resume.isProfilePublic}
                  onChange={(e) => handleInputChange('isProfilePublic', e.target.checked)}
                />
                Make my profile visible to employers
              </label>
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={resume.isOpenToWork}
                  onChange={(e) => handleInputChange('isOpenToWork', e.target.checked)}
                />
                I'm open to work
              </label>
            </div>
          </section>
        </div>

        <div className="resume-footer-actions">
          <button onClick={handleSave} disabled={saving} className="btn-save-large">
            {saving ? 'Saving...' : '💾 Save Resume'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;

