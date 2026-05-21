import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'phoenix' && password === 'phoenix2025') {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/admin');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="animate-fade-slide">
      <div className="hero">
        <div className="hero-label">Secured Access</div>
        <h1>Admin <em>Portal</em></h1>
        <p>Sign in to access the Phoenix Coach Console, review assessments, and manage client stories.</p>
      </div>

      <div className="container" style={{ maxWidth: '440px' }}>
        <div className="login-card hover-glow">
          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Username</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="Enter username"
                required 
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Enter password"
                required 
              />
            </div>

            <button type="submit" className="btn btn-primary scale-on-hover" style={{ width: '100%', marginTop: '10px' }}>
              Sign In →
            </button>
          </form>

          <div className="login-card-footer">
            Secured Access for Phoenix Admin Personnel Only.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
