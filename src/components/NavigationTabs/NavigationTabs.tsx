
import React, { useState } from 'react';
import './NavigationTabs.css';

interface NavigationTabsProps {
  isScrolled: boolean;
}

const NavigationTabs: React.FC<NavigationTabsProps> = ({ isScrolled }) => {
  const [isOpen, setIsOpen] = useState(false);

  const tabs = [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Booking', href: '#booking' },
    { label: 'Contact', href: '#contact' }
  ];

  return (
    <nav className={`navigation-tabs ${isScrolled ? 'scrolled' : ''} ${isOpen ? 'open' : ''}`}>
      <button 
        className="nav-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation"
      >
        <span className="toggle-line"></span>
        <span className="toggle-line"></span>
        <span className="toggle-line"></span>
      </button>
      
      <div className="tabs-container">
        {tabs.map((tab, index) => (
          <a
            key={index}
            href={tab.href}
            className="nav-tab"
            onClick={() => setIsOpen(false)}
          >
            <span className="tab-number">0{index + 1}</span>
            <span className="tab-label">{tab.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
};

export default NavigationTabs;
