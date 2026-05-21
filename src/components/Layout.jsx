import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <>
      <header className="site-header">
        <Link to="/" className="site-logo">Phoenix <span>Clear Insight</span></Link>
        <nav className="site-nav">
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
