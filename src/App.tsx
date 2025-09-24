
import React, { useState, useEffect } from 'react';
import './App.css';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Services from './components/Services/Services';
import BookingCalendar from './components/BookingCalendar/BookingCalendar';
import Contact from './components/Contact/Contact';
import NavigationTabs from './components/NavigationTabs/NavigationTabs';

function App() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="app">
      <NavigationTabs isScrolled={isScrolled} />
      <Hero />
      <About />
      <Services />
      <BookingCalendar />
      <Contact />
    </div>
  );
}

export default App;
