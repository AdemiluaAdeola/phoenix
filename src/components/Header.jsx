import { NavLink } from 'react-router-dom'

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-brand">
        <div className="site-logo">Phoenix <span>Clear Insight</span></div>
        <div className="header-tagline">See It · Believe It · Achieve It</div>
      </div>
      <nav className="site-nav">
        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          Home
        </NavLink>
        <NavLink to="/assessment" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          Assessment
        </NavLink>
        <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          Admin
        </NavLink>
      </nav>
    </header>
  )
}
