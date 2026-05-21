import React from 'react';
import './BlogPage.css';

const BlogPage = () => {
  return (
    <div className="animate-fade-slide" style={{ paddingBottom: '60px' }}>
      <div className="journal-header">
        <div className="journal-label">Coaching Insight Journal</div>
        <h1>Three Posts.<br />One Story.</h1>
        <p>Where Phoenix began, how the work evolved, and who it serves now. Read in sequence or enter wherever you are.</p>
      </div>

      <div className="series-intro">
        <div className="series-card">
          <h3 style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '12px' }}>About This Series</h3>
          <p style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: 1.7, marginBottom: '14px' }}>
            These three posts are a narrative arc — not three disconnected articles. They tell the honest story of how Phoenix Clear Insight Consulting came to be, what the work stands for, and who it is designed to serve.
          </p>
          <ul style={{ paddingLeft: '20px', color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.8 }}>
            <li><strong>Post 1:</strong> Federal Insider Perspective — Where it began</li>
            <li><strong>Post 2:</strong> Strategic Joy — The framework that found its audience</li>
            <li><strong>Post 3:</strong> Empowering Growth — The full evolution</li>
          </ul>
        </div>
      </div>

      <article className="post">
        <div className="post-header">
          <div className="post-series-tag">Coaching Insight Journal &nbsp;·&nbsp; Post 1 of 3</div>
          <h2>Federal Insider Perspective: Consulting for Working Parents and Teens</h2>
          <div className="subtitle">Where Phoenix began — and what it was always really about.</div>
        </div>
        <div className="post-body">
          <div className="post-meta">
            <span>May 20, 2025</span>
            <span className="dot"></span>
            <span>4 min read</span>
          </div>

          <p>I didn't start here.</p>
          <p>I started at home. At my kitchen table, or maybe the couch — I don't remember exactly, because what I do remember is the email.</p>
          <p>I had just come back from leave. Use-or-lose time that I had finally taken to be with my family — real time, present time, the kind you can't get back. And while I was still in that space, still exhaling, I learned that someone I loved had died. Grief had just walked in the door.</p>
          <p>Then the email arrived.</p>
          
          <div className="section-divider">— ◆ —</div>
          
          <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1.1rem', color: 'var(--navy)', margin: '2.4em 0 0.8em' }}>What I Knew That No One Else Did</h3>
          <p>Here's the thing about working inside the federal government for that long: you develop a kind of dual vision. You understand the system — the rhythms, the culture, the unspoken rules, the career ladder, the weight of acronyms and clearances and GS-levels. But you also see the people inside the system.</p>

          <div className="pull-quote">
            <p>Capable people — brilliant, dedicated, experienced people — who had quietly lost themselves inside an institution. They were succeeding by every external measure and quietly unraveling inside.</p>
          </div>

        </div>
      </article>

      <article className="post">
        <div className="post-header">
          <div className="post-series-tag">Coaching Insight Journal &nbsp;·&nbsp; Post 2 of 3</div>
          <h2>Strategic Joy Approach: Life Skills Training for Small Business Owners</h2>
          <div className="subtitle">Why finding your joy isn't soft — it's the most strategic thing you can do.</div>
        </div>
        <div className="post-body">
          <div className="post-meta">
            <span>May 20, 2025</span>
            <span className="dot"></span>
            <span>4 min read</span>
          </div>

          <p>Let me tell you what Strategic Joy is not.</p>
          <p>It is not a vision board. It is not positive thinking. It is not a motivational poster or a morning affirmation or a weekend retreat where you drink green juice and call it transformation.</p>
          <p>Strategic Joy is the deliberate, honest work of figuring out what actually matters to you — not what you've been told should matter, not what looks good on paper, not what keeps the people around you comfortable — but what is true. And then building a life and a career that moves toward that truth, on purpose.</p>
          
        </div>
      </article>
      
    </div>
  );
};

export default BlogPage;
