
import React from 'react';
import './About.css';

const About: React.FC = () => {
  return (
    <section id="about" className="about">
      <div className="about-container">
        <div className="section-header">
          <p className="section-tagline">About Us</p>
          <h2 className="section-title">Dedicated to Your Financial Excellence</h2>
        </div>
        
        <div className="about-content">
          <div className="about-text">
            <h3>Your Trusted Accounting Professional</h3>
            <p>
              [Professional Name] brings [X] years of expertise in comprehensive accounting services.
              With a deep understanding of financial regulations and a commitment to personalized service,
              we help individuals and businesses navigate complex financial landscapes with confidence.
            </p>
            <p>
              Our approach combines traditional accounting principles with modern technology to deliver
              efficient, accurate, and timely financial solutions. We believe in building long-term
              relationships based on trust, integrity, and exceptional service.
            </p>
            
            <div className="credentials">
              <div className="credential-item">
                <span className="credential-icon">✓</span>
                <div>
                  <h4>[Certification 1]</h4>
                  <p>Professional certification details</p>
                </div>
              </div>
              <div className="credential-item">
                <span className="credential-icon">✓</span>
                <div>
                  <h4>[Certification 2]</h4>
                  <p>Professional certification details</p>
                </div>
              </div>
              <div className="credential-item">
                <span className="credential-icon">✓</span>
                <div>
                  <h4>[Years] of Experience</h4>
                  <p>Proven track record of success</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="about-values">
            <h3>Our Core Values</h3>
            <div className="values-grid">
              <div className="value-card">
                <h4>Integrity</h4>
                <p>Maintaining the highest ethical standards in all our services</p>
              </div>
              <div className="value-card">
                <h4>Excellence</h4>
                <p>Delivering superior quality in every aspect of our work</p>
              </div>
              <div className="value-card">
                <h4>Trust</h4>
                <p>Building lasting relationships through reliable service</p>
              </div>
              <div className="value-card">
                <h4>Innovation</h4>
                <p>Embracing modern solutions for better outcomes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
