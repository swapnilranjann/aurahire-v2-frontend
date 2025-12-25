import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/CareerAdvice.css';

const CareerAdviceDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      const response = await api.get(`/career-advice/${id}`);
      setArticle(response.data);
    } catch (error) {
      console.error('Error fetching article:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="career-advice-loading">Loading...</div>;
  }

  if (!article) {
    return (
      <div className="career-advice-page">
        <div className="career-advice-container">
          <h2>Article not found</h2>
          <Link to="/career-advice">Back to Career Advice</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="career-advice-page">
      <div className="career-advice-container">
        <Link to="/career-advice" className="back-link">← Back to Career Advice</Link>
        <article className="article-detail">
          <div className="article-header">
            <span className="article-category-badge">{article.category}</span>
            <h1>{article.title}</h1>
            <div className="article-meta">
              <span>By {article.author || 'Career Expert'}</span>
              <span>•</span>
              <span>{new Date(article.createdAt).toLocaleDateString('en-IN')}</span>
              <span>•</span>
              <span>👁️ {article.views} views</span>
            </div>
          </div>
          <div className="article-content">
            {article.content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
};

export default CareerAdviceDetail;

