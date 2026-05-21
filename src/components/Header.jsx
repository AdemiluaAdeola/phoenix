import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="site-header">
      <nav>
        <ul className="nav-list">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/assessment">Clarity Assessment</Link></li>
          <li><Link to="/admin">Admin Dashboard</Link></li>
        </ul>
      </nav>
    </header>
  )
}
