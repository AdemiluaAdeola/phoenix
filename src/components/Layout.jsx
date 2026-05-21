import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu whenever location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <header className="site-header">
        <Link to="/" className="site-logo">Phoenix <span>Clear Insight</span></Link>
        
        {/* Hamburger Menu Icon */}
        <button 
          className={`mobile-menu-toggle ${isMobileMenuOpen ? 'open' : ''}`} 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        <nav className={`site-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
          <Link to="/assessment" className={location.pathname === '/assessment' ? 'active' : ''}>Assessment</Link>
          <Link to="/client-stories" className={location.pathname === '/client-stories' ? 'active' : ''}>Stories</Link>
          <Link to="/blog" className={location.pathname === '/blog' ? 'active' : ''}>Journal</Link>
          <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>Login</Link>
        </nav>
      </header>
      
      <main>
        {children}
      </main>

      <footer className="site-footer">
        © 2026 <span>Phoenix Clear Insight Consulting LLC</span> · VetaBravo · See It. Believe It. Achieve It. · <span>phoenixclearinsight.com</span>
      </footer>
    </>
  );
};

export default Layout;
