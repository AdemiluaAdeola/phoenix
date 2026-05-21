import React, { useEffect, useState } from 'react';
import { db } from '../db';

const ClientStoriesPage = () => {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const loadStories = async () => {
      const allTestimonials = await db.testimonials.toArray();
      const approved = allTestimonials.filter(t => t.status === 'Approved');
      setStories(approved);
    };
    loadStories();
  }, []);

  return (
    <div className="container animate-fade-slide">
      <div className="hero" style={{ borderRadius: '12px', marginBottom: '32px' }}>
        <div className="hero-label">Client Stories</div>
        <h1>The <em>Transformation</em></h1>
        <p>Real stories from clients who have navigated their transitions with Phoenix.</p>
      </div>

      <div style={{ maxWidth: '780px', margin: '0 auto' }}>
        {stories.length === 0 ? (
          <div className="card" style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--muted)' }}>No stories available yet.</p>
          </div>
        ) : (
          stories.map(story => (
            <div key={story.id} className="card" style={{ borderLeft: '4px solid var(--gold)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem' }}>{story.anonymous === 'Yes' ? 'Anonymous Client' : `${story.firstName} ${story.lastName}`}</h3>
                  {story.role && <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{story.role}</p>}
                </div>
                {story.stage && (
                  <span style={{ background: 'var(--gold-dim)', color: 'var(--gold)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>
                    {story.stage}
                  </span>
                )}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--navy)', letterSpacing: '0.06em', marginBottom: '4px' }}>Before</h4>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>{story.before}</p>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--navy)', letterSpacing: '0.06em', marginBottom: '4px' }}>The Shift</h4>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>{story.shift}</p>
              </div>

              <div>
                <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--navy)', letterSpacing: '0.06em', marginBottom: '4px' }}>After</h4>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>{story.after}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ClientStoriesPage;
