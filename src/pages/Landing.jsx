import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <section className="landing">
      <div className="hero">
        <h1>Clarity Assessment</h1>
        <p>Take a short assessment to discover clarity around your goals.</p>
        <div className="actions">
          <Link to="/assessment" className="btn">Start Assessment</Link>
          <Link to="/admin" className="btn muted">Admin Dashboard</Link>
        </div>
      </div>
      <section className="features">
        <h2>About</h2>
        <p>This tool stores submissions locally and provides an admin view with export.</p>
      </section>
    </section>
  )
}
