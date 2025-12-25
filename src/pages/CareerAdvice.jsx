import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/CareerAdvice.css';

const CareerAdvice = () => {
  const [articles, setArticles] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
    fetchFeatured();
    fetchCategories();
  }, [selectedCategory]);

  const fetchArticles = async () => {
    try {
      const params = selectedCategory ? { category: selectedCategory } : {};
      const response = await api.get('/career-advice', { params });
      setArticles(response.data?.articles || response.data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeatured = async () => {
    try {
      const response = await api.get('/career-advice/featured/list');
      setFeatured(response.data || []);
    } catch (error) {
      console.error('Error fetching featured:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/career-advice/categories/list');
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return <div className="career-advice-loading">Loading...</div>;
  }

  return (
    <div className="career-advice-page">
      <div className="career-advice-container">
        <div className="advice-header">
          <h1>Career Advice</h1>
          <p>Expert tips and insights to advance your career</p>
        </div>

        {/* Featured Articles */}
        {featured.length > 0 && (
          <section className="featured-section">
            <h2>Featured Articles</h2>
            <div className="featured-grid">
              {featured.map((article) => (
                <Link key={article.id} to={`/career-advice/${article.id}`} className="featured-card">
                  <div className="featured-badge">⭐ Featured</div>
                  <h3>{article.title}</h3>
                  <p className="article-meta">
                    {article.category} • {formatDate(article.createdAt)} • 👁️ {article.views}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Categories Filter */}
        <div className="categories-filter">
          <button
            onClick={() => setSelectedCategory('')}
            className={selectedCategory === '' ? 'active' : ''}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={selectedCategory === cat ? 'active' : ''}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles List */}
        <div className="articles-grid">
          {articles.map((article) => (
            <Link key={article.id} to={`/career-advice/${article.id}`} className="article-card">
              <div className="article-category">{article.category}</div>
              <h3>{article.title}</h3>
              <p className="article-excerpt">
                {article.content.substring(0, 150)}...
              </p>
              <div className="article-footer">
                <span>By {article.author || 'Career Expert'}</span>
                <span>👁️ {article.views} views</span>
              </div>
            </Link>
          ))}
        </div>

        {articles.length === 0 && !loading && (
          <div className="no-articles">
            <p>No articles found. Check back soon for career advice articles!</p>
            <p style={{ fontSize: '14px', color: '#64748b', marginTop: '8px' }}>
              Articles are being added. Please try again later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerAdvice;

