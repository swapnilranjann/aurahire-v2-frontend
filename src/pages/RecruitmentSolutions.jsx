import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/RecruitmentSolutions.css';

const RecruitmentSolutions = () => {
  const [solutions, setSolutions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSolutions();
  }, []);

  const fetchSolutions = async () => {
    try {
      const response = await api.get('/recruitment/solutions');
      setSolutions(response.data);
    } catch (error) {
      console.error('Error fetching solutions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="recruitment-solutions-loading">Loading...</div>;
  }

  return (
    <div className="recruitment-solutions-page">
      <div className="solutions-container">
        <div className="solutions-hero">
          <h1>Recruitment Solutions</h1>
          <p>Streamline your hiring process with our comprehensive recruitment platform</p>
        </div>

        {solutions && (
          <>
            <section className="features-section">
              <h2>Powerful Features for Employers</h2>
              <div className="features-grid">
                {solutions.features.map((feature, index) => (
                  <div key={index} className="feature-card">
                    <div className="feature-icon-large">{feature.icon}</div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="benefits-section">
              <h2>Why Choose Our Platform?</h2>
              <div className="benefits-grid">
                {solutions.benefits.map((benefit, index) => (
                  <div key={index} className="benefit-item">
                    <span className="check-icon">✓</span>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        <section className="cta-section">
          <h2>Ready to Transform Your Hiring Process?</h2>
          <p>Choose a plan that fits your needs</p>
          <Link to="/pricing" className="btn-view-pricing">
            View Pricing Plans
          </Link>
        </section>
      </div>
    </div>
  );
};

export default RecruitmentSolutions;

