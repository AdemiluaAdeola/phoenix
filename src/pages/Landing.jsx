import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <section className="landing">
      <div className="hero">
        <div className="hero-label">Clarity Assessment & Coaching</div>
        <h1>Build your next chapter with clarity.</h1>
        <p>
          The Phoenix platform brings a refined assessment experience, local coaching tools,
          and an admin view that turns clarity into action.
        </p>
        <div className="hero-meta">
          <span><span className="dot" />25-question assessment</span>
          <span><span className="dot" />Data saved locally</span>
          <span><span className="dot" />Easy export to Excel</span>
        </div>
        <div className="hero-actions">
          <Link to="/assessment" className="btn btn-primary">Start Assessment</Link>
          <Link to="/admin" className="btn btn-secondary">Open Admin Dashboard</Link>
        </div>
      </div>

      <div className="container">
        <div className="series-intro">
          <div className="series-card">
            <h3>Why Phoenix?</h3>
            <p>
              This site blends the refined Phoenix brand with a practical assessment workflow.
              It guides visitors through a welcoming landing experience, a structured clarity assessment,
              and an admin dashboard for monitoring submissions and exporting data.
            </p>
            <ul>
              <li><strong>Simple intake:</strong> collect names, email, and reflection responses.</li>
              <li><strong>Visible progress:</strong> a clear hero experience with Phoenix styling.</li>
              <li><strong>Admin export:</strong> download assessment submissions to Excel instantly.</li>
            </ul>
          </div>
        </div>

        <div className="spotlight">
          <div className="section-card">
            <h3>Clarity Assessment</h3>
            <p>
              A premium assessment experience designed around Phoenix's See It → Believe It → Achieve It
              methodology. Capture meaningful responses, support scheduling, and save results locally.
            </p>
          </div>
          <div className="section-card">
            <h3>Admin Dashboard</h3>
            <p>
              Monitor assessment data in one place, export submissions to Excel, and keep the coaching
              journey organized with branded clarity tools.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
