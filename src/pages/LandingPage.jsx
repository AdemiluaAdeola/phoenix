import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="animate-fade-slide landing-wrapper">
      {/* Premium Hero Section */}
      <div className="hero landing-hero">
        <div className="hero-label">Strategic Joy & Leadership Coaching</div>
        <h1><em>Phoenix</em> Clear Insight Consulting</h1>
        <p>Strategic Joy isn't soft. It's the most strategic choice you can make to design a business and life aligned with your truth.</p>
        <div className="hero-meta landing-hero-buttons">
          <Link to="/assessment" className="btn btn-gold scale-on-hover">Take the Clarity Assessment →</Link>
          <Link to="/blog" className="btn btn-secondary scale-on-hover">Read the Journal</Link>
        </div>
      </div>

      <div className="container">
        {/* About Section */}
        <div className="card about-card hover-glow">
          <h3>Welcome to Phoenix</h3>
          <p className="about-text">
            Phoenix Clear Insight Consulting serves professional women in transition. 
            Whether you are leaving corporate, launching something of your own, or returning after a pause, 
            we provide the framework to discover what matters most.
          </p>
        </div>

        {/* The Methodology Section */}
        <div className="methodology-section">
          <h2 className="section-title">The Three Movements of Transformation</h2>
          <p className="section-subtitle">Our core methodology guides you from reflection to sustainable, aligned action.</p>
          
          <div className="methodology-grid">
            <div className="methodology-card hover-lift">
              <div className="step-num">01</div>
              <h3>See It</h3>
              <p>Radical honesty with your current reality. Before deciding where to go, we look clearly at where you actually are—naming the patterns running in the background.</p>
            </div>

            <div className="methodology-card hover-lift">
              <div className="step-num">02</div>
              <h3>Believe It</h3>
              <p>Examining identity. High-achievers often run on outdated operating systems. We update the internal permission structure allowing you to claim what you want.</p>
            </div>

            <div className="methodology-card hover-lift">
              <div className="step-num">03</div>
              <h3>Achieve It</h3>
              <p>Action flowing from alignment, not obligation. We turn insights into a sustainable plan, taking one intentional, clear step at a time.</p>
            </div>
          </div>
        </div>

        {/* Quote Block */}
        <div className="landing-quote-block">
          <div className="quote-mark">“</div>
          <p className="quote-text">Capableness is not the same as alignment. You can be successful by every external metric and still be quietly unraveling inside. Real success begins when you decide to claim your own direction.</p>
          <div className="quote-author">— Veta P. Hurst, Esq., ICF-ACC</div>
        </div>

        {/* Call to Action Grid */}
        <div className="cta-grid">
          <div className="cta-card hover-glow">
            <h3>Start With Clarity</h3>
            <p>Our 25-question assessment measures your score across 5 key dimensions of clarity and readiness.</p>
            <Link to="/assessment" className="btn btn-gold scale-on-hover">Begin Free Assessment →</Link>
          </div>
          <div className="cta-card secondary hover-lift">
            <h3>Explore Client Journeys</h3>
            <p>Read real stories of transformation from professionals who have stepped into their next chapter.</p>
            <Link to="/client-stories" className="btn btn-secondary scale-on-hover">View Client Stories</Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;
