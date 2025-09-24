
import React from 'react';
import './Services.css';

const Services: React.FC = () => {
  const services = [
    {
      title: '[Service Category 1]',
      description: 'Comprehensive financial management and reporting services tailored to your needs',
      features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4']
    },
    {
      title: '[Service Category 2]',
      description: 'Strategic planning and consultation for optimal financial performance',
      features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4']
    },
    {
      title: '[Service Category 3]',
      description: 'Specialized services for complex financial requirements',
      features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4']
    }
  ];

  return (
    <section id="services" className="services">
      <div className="services-container">
        <div className="section-header">
          <p className="section-tagline">Our Services</p>
          <h2 className="section-title">Comprehensive Financial Solutions</h2>
          <p className="section-description">
            We offer a full range of accounting services designed to meet your unique needs
            and help you achieve your financial goals.
          </p>
        </div>
        
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-number">0{index + 1}</div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              
              <ul className="service-features">
                {service.features.map((feature, idx) => (
                  <li key={idx}>
                    <span className="feature-bullet">▪</span>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button className="service-btn">Learn More</button>
            </div>
          ))}
        </div>
        
        <div className="services-cta">
          <h3>Ready to Get Started?</h3>
          <p>Contact us today to discuss how we can help with your accounting needs.</p>
          <button className="cta-btn">Schedule Consultation</button>
        </div>
      </div>
    </section>
  );
};

export default Services;
