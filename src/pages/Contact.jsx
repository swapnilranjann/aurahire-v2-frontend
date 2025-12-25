import React, { useState } from 'react';
import "../styles/Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[\d\s\-+()]{10,}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitMessage({ type: '', text: '' });

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitMessage({
        type: 'success',
        text: 'Thank you! Your message has been sent successfully.'
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        location: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        text: 'Something went wrong. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: '📧',
      title: 'Email',
      content: 'support@jobportal.com',
      link: 'mailto:support@jobportal.com'
    },
    {
      icon: '📞',
      title: 'Phone',
      content: '+91 1800 123 4567',
      link: 'tel:+911800123456'
    },
    {
      icon: '📍',
      title: 'Address',
      content: '123 Tech Park, Bangalore, India',
      link: null
    }
  ];

  return (
    <article className="contact-us">
      {/* Hero */}
      <section className="contact-hero">
        <h2>Contact Us</h2>
        <p className="contact-subtitle">
          Have questions? We'd love to hear from you.
        </p>
      </section>

      <div className="contact-wrapper">
        {/* Contact Form */}
        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          {submitMessage.text && (
            <div className={`form-message ${submitMessage.type}`} role="alert">
              {submitMessage.text}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
              placeholder="Enter your name"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? 'error' : ''}
              placeholder="Enter your phone number"
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject *</label>
            <input 
              type="text" 
              id="subject" 
              name="subject" 
              value={formData.subject}
              onChange={handleChange}
              className={errors.subject ? 'error' : ''}
              placeholder="What is this about?"
            />
            {errors.subject && <span className="error-message">{errors.subject}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="message">Message *</label>
            <textarea 
              id="message" 
              name="message" 
              value={formData.message}
              onChange={handleChange}
              className={errors.message ? 'error' : ''}
              placeholder="Type your message here..."
            ></textarea>
            {errors.message && <span className="error-message">{errors.message}</span>}
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>

        {/* Contact Info */}
        <aside className="contact-info">
          {contactInfo.map((info, index) => (
            <div className="contact-card" key={index}>
              <div className="contact-card-icon">{info.icon}</div>
              <div className="contact-card-content">
                <h3>{info.title}</h3>
                {info.link ? (
                  <p><a href={info.link}>{info.content}</a></p>
                ) : (
                  <p>{info.content}</p>
                )}
              </div>
            </div>
          ))}
          
          <div className="contact-faq">
            <h4>Quick Help</h4>
            <ul>
              <li><a href="#">How to create an account?</a></li>
              <li><a href="#">How to apply for jobs?</a></li>
              <li><a href="#">Reset password</a></li>
              <li><a href="#">Report an issue</a></li>
            </ul>
          </div>
        </aside>
      </div>
    </article>
  );
};

export default Contact;
