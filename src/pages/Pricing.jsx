import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/Pricing.css';

const Pricing = () => {
  const { isAuthenticated, isHR } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [solutions, setSolutions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
    fetchSolutions();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await api.get('/recruitment/plans');
      setPlans(response.data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSolutions = async () => {
    try {
      const response = await api.get('/recruitment/solutions');
      setSolutions(response.data);
    } catch (error) {
      console.error('Error fetching solutions:', error);
      setSolutions(null);
    }
  };

  const handleSelectPlan = (plan) => {
    if (!isAuthenticated || !isHR) {
      navigate('/login', { state: { from: '/pricing' } });
      return;
    }
    alert(`Selected plan: ${plan.name}. Payment integration would be implemented here.`);
  };

  if (loading) {
    return <div className="pricing-loading">Loading...</div>;
  }

  return (
    <div className="pricing-page">
      <div className="pricing-container">
        <div className="pricing-header">
          <h1>Recruitment Solutions & Pricing</h1>
          <p>Choose the perfect plan for your hiring needs</p>
        </div>

        {solutions ? (
          <section className="solutions-section">
            <h2>Why Choose Our Platform?</h2>
            <div className="features-grid">
              {solutions.features?.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="feature-icon">{feature.icon}</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>

            {solutions.benefits && (
              <div className="benefits-section">
                <h3>Key Benefits</h3>
                <ul className="benefits-list">
                  {solutions.benefits.map((benefit, index) => (
                    <li key={index}>✓ {benefit}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        ) : (
          !loading && (
            <section className="solutions-section">
              <p style={{ textAlign: 'center', color: '#64748b' }}>Solutions information loading...</p>
            </section>
          )
        )}

        <section className="pricing-plans">
          <h2>Choose Your Plan</h2>
          {loading ? (
            <div className="no-plans" style={{ textAlign: 'center', padding: '60px' }}>
              <p>Loading plans...</p>
            </div>
          ) : plans.length === 0 ? (
            <div className="no-plans" style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
              <p>No pricing plans available at the moment.</p>
              <p style={{ fontSize: '14px', marginTop: '8px' }}>Please contact support or check back later.</p>
            </div>
          ) : (
            <div className="plans-grid">
              {plans.map((plan) => (
              <div key={plan.id} className={`plan-card ${plan.name.toLowerCase()}`}>
                <div className="plan-header">
                  <h3>{plan.name}</h3>
                  <div className="plan-price">
                    <span className="currency">₹</span>
                    <span className="amount">{plan.price.toLocaleString()}</span>
                    <span className="period">/month</span>
                  </div>
                </div>
                <ul className="plan-features">
                  {plan.features && plan.features.map((feature, index) => (
                    <li key={index}>✓ {feature}</li>
                  ))}
                  {plan.job_postings_limit ? (
                    <li>✓ {plan.job_postings_limit} Job Postings</li>
                  ) : (
                    <li>✓ Unlimited Job Postings</li>
                  )}
                  {plan.resume_views_limit ? (
                    <li>✓ {plan.resume_views_limit} Resume Views</li>
                  ) : (
                    <li>✓ Unlimited Resume Views</li>
                  )}
                  {plan.featured_jobs !== null && (
                    <li>✓ {plan.featured_jobs || 'Unlimited'} Featured Jobs</li>
                  )}
                  {plan.analytics_access && <li>✓ Analytics Dashboard</li>}
                  {plan.priority_support && <li>✓ Priority Support</li>}
                  {plan.custom_branding && <li>✓ Custom Branding</li>}
                </ul>
                <button
                  onClick={() => handleSelectPlan(plan)}
                  className={`btn-select-plan ${plan.name.toLowerCase()}`}
                >
                  Select Plan
                </button>
              </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Pricing;

