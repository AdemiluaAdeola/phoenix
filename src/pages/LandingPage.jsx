import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="animate-fade-slide">
      <div className="hero">
        <div className="hero-label">Transformative Coaching</div>
        <h1><em>Phoenix</em> Clear Insight Consulting</h1>
        <p>Strategic Joy isn't soft. It's the most strategic thing you can do for your business and life.</p>
        <div className="hero-meta" style={{ marginTop: '20px' }}>
          <Link to="/assessment" className="btn btn-gold">Take the Clarity Assessment</Link>
          <Link to="/blog" className="btn btn-secondary">Read the Journal</Link>
        </div>
      </div>

      <div className="container">
        <div className="card" style={{ textAlign: 'center' }}>
          <h3>Welcome to Phoenix</h3>
          <p style={{ marginTop: '16px', color: 'var(--muted)' }}>
            Phoenix Clear Insight Consulting serves professional women in transition. 
            Whether you are leaving corporate, launching something of your own, or returning after a pause, 
            we provide the framework to discover what matters most.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
