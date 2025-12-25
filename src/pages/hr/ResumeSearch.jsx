import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import '../../styles/ResumeSearch.css';

const ResumeSearch = () => {
  const { isAuthenticated, isHR } = useAuth();
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    keyword: '',
    skills: '',
    location: '',
    experience_years: '',
    education: '',
    salary_range: '',
  });
  const [availableFilters, setAvailableFilters] = useState({
    skills: [],
    locations: [],
  });
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [pagination, setPagination] = useState({ total: 0, limit: 20, offset: 0 });

  useEffect(() => {
    if (!isAuthenticated || !isHR) {
      navigate('/login');
      return;
    }
    fetchFilters();
  }, [isAuthenticated, isHR, navigate]);

  const fetchFilters = async () => {
    try {
      const response = await api.get('/resume-search/filters');
      setAvailableFilters(response.data);
    } catch (error) {
      console.error('Error fetching filters:', error);
    }
  };

  const handleSearch = async (offset = 0) => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        limit: pagination.limit,
        offset,
      };
      const response = await api.get('/resume-search/search', { params });
      setCandidates(response.data.candidates || []);
      setPagination(response.data.pagination || pagination);
    } catch (error) {
      console.error('Error searching resumes:', error);
      alert('Failed to search resumes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const viewCandidate = async (userId) => {
    try {
      const response = await api.get(`/resume-search/candidate/${userId}`);
      setSelectedCandidate(response.data);
    } catch (error) {
      console.error('Error fetching candidate:', error);
    }
  };

  const formatSkills = (skills) => {
    if (!skills) return [];
    return Array.isArray(skills) ? skills : [];
  };

  if (selectedCandidate) {
    return (
      <div className="resume-search-page">
        <div className="candidate-detail-container">
          <button onClick={() => setSelectedCandidate(null)} className="btn-back">
            ← Back to Search
          </button>
          <div className="candidate-profile">
            <div className="candidate-header">
              <h1>{selectedCandidate.name}</h1>
              <div className="candidate-contact">
                <span>📧 {selectedCandidate.email}</span>
                {selectedCandidate.phone && <span>📞 {selectedCandidate.phone}</span>}
              </div>
            </div>

            {selectedCandidate.headline && (
              <div className="candidate-section">
                <h3>Headline</h3>
                <p>{selectedCandidate.headline}</p>
              </div>
            )}

            {selectedCandidate.summary && (
              <div className="candidate-section">
                <h3>Summary</h3>
                <p>{selectedCandidate.summary}</p>
              </div>
            )}

            {selectedCandidate.experience && selectedCandidate.experience.length > 0 && (
              <div className="candidate-section">
                <h3>Experience</h3>
                {selectedCandidate.experience.map((exp, index) => (
                  <div key={index} className="experience-item">
                    <h4>{exp.title} at {exp.company}</h4>
                    <p>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                    {exp.description && <p>{exp.description}</p>}
                  </div>
                ))}
              </div>
            )}

            {selectedCandidate.education && selectedCandidate.education.length > 0 && (
              <div className="candidate-section">
                <h3>Education</h3>
                {selectedCandidate.education.map((edu, index) => (
                  <div key={index} className="education-item">
                    <h4>{edu.degree} in {edu.field}</h4>
                    <p>{edu.institution} - {edu.endDate}</p>
                  </div>
                ))}
              </div>
            )}

            {selectedCandidate.skills && selectedCandidate.skills.length > 0 && (
              <div className="candidate-section">
                <h3>Skills</h3>
                <div className="skills-list">
                  {formatSkills(selectedCandidate.skills).map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="candidate-actions">
              <a href={`mailto:${selectedCandidate.email}`} className="btn-contact">
                📧 Contact Candidate
              </a>
              {selectedCandidate.resume && (
                <a href={selectedCandidate.resume} target="_blank" rel="noopener noreferrer" className="btn-download-resume">
                  📥 Download Resume
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="resume-search-page">
      <div className="resume-search-container">
        <div className="search-header">
          <h1>Search Resumes</h1>
          <p>Find the perfect candidate for your job openings</p>
        </div>

        <div className="search-filters">
          <div className="filter-row">
            <input
              type="text"
              placeholder="Search by name, headline, or keywords..."
              value={filters.keyword}
              onChange={(e) => handleFilterChange('keyword', e.target.value)}
              className="filter-input"
            />
            <input
              type="text"
              placeholder="Location"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="filter-input"
            />
            <input
              type="text"
              placeholder="Skills (comma-separated)"
              value={filters.skills}
              onChange={(e) => handleFilterChange('skills', e.target.value)}
              className="filter-input"
            />
            <button onClick={() => handleSearch(0)} className="btn-search" disabled={loading}>
              {loading ? 'Searching...' : '🔍 Search'}
            </button>
          </div>
        </div>

        <div className="search-results">
          {candidates.length === 0 && !loading ? (
            <div className="no-results">
              <p>No candidates found. Try adjusting your search filters.</p>
            </div>
          ) : (
            <>
              <div className="results-header">
                <h3>Found {pagination.total} candidates</h3>
              </div>
              <div className="candidates-list">
                {candidates.map((candidate) => (
                  <div key={candidate.id} className="candidate-card">
                    <div className="candidate-card-header">
                      <h3>{candidate.name}</h3>
                      <span className="candidate-location">📍 {candidate.currentLocation || 'Not specified'}</span>
                    </div>
                    {candidate.headline && (
                      <p className="candidate-headline">{candidate.headline}</p>
                    )}
                    {candidate.summary && (
                      <p className="candidate-summary">{candidate.summary.substring(0, 150)}...</p>
                    )}
                    {candidate.skills && candidate.skills.length > 0 && (
                      <div className="candidate-skills">
                        {formatSkills(candidate.skills).slice(0, 5).map((skill, index) => (
                          <span key={index} className="skill-badge">{skill}</span>
                        ))}
                      </div>
                    )}
                    <div className="candidate-card-footer">
                      <button onClick={() => viewCandidate(candidate.user_id)} className="btn-view-profile">
                        View Full Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {pagination.total > pagination.limit && (
                <div className="pagination">
                  <button
                    onClick={() => handleSearch(Math.max(0, pagination.offset - pagination.limit))}
                    disabled={pagination.offset === 0}
                  >
                    ← Previous
                  </button>
                  <span>
                    Page {Math.floor(pagination.offset / pagination.limit) + 1} of {Math.ceil(pagination.total / pagination.limit)}
                  </span>
                  <button
                    onClick={() => handleSearch(pagination.offset + pagination.limit)}
                    disabled={pagination.offset + pagination.limit >= pagination.total}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeSearch;

