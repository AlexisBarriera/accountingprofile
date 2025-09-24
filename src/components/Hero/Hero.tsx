
import React from 'react';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <section id="hero" className="hero">
      <div className="hero-overlay"></div>
      <div className="hero-banner">
        <div className="banner-content">
          <p className="banner-tagline">Excellence in Financial Management</p>
          <h1 className="banner-title">Professional Accounting Services</h1>
          <div className="banner-divider"></div>
        </div>
      </div>
      
      <div className="hero-content">
        <div className="hero-text">
          <h2 className="hero-subtitle">Trusted Financial Expertise</h2>
          <h1 className="hero-title">
            Your Partner in<br/>
            <span className="hero-accent">Financial Success</span>
          </h1>
          <p className="hero-description">
            With over [X] years of experience, we provide comprehensive accounting solutions
            tailored to meet your unique financial needs. Our commitment to excellence and
            attention to detail ensures your complete peace of mind.
          </p>
          <div className="hero-cta">
            <button className="btn-primary">Schedule Consultation</button>
            <button className="btn-secondary">Learn More</button>
          </div>
        </div>
        
        <div className="hero-features">
          <div className="feature-card">
            <span className="feature-icon">▪</span>
            <h3>[Service Area 1]</h3>
            <p>Professional expertise in comprehensive financial management</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">▪</span>
            <h3>[Service Area 2]</h3>
            <p>Strategic planning for sustainable business growth</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">▪</span>
            <h3>[Service Area 3]</h3>
            <p>Personalized solutions for your unique needs</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
