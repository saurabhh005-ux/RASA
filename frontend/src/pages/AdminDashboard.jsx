import React, { useState, useEffect } from 'react';
import AdminProjects from '../components/admin/AdminProjects';
import AdminContent from '../components/admin/AdminContent';
import AdminAppointments from '../components/admin/AdminAppointments';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('adminToken', data.token);
        setIsAuthenticated(true);
      } else {
        setLoginError(data.error || 'Login failed');
      }
    } catch (error) {
      setLoginError('Server connection error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-container fade-in">
        <form className="admin-login-form" onSubmit={handleLogin}>
          <h2>Admin Access</h2>
          {loginError && <div className="error-message">{loginError}</div>}
          <div className="form-group">
            <input 
              type="text" 
              placeholder="Username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn-primary form-submit" disabled={isLoading}>
            {isLoading ? 'Authenticating...' : 'Log In'}
          </button>
        </form>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'projects':
        return <AdminProjects />;
      case 'content':
        return <AdminContent />;
      case 'appointments':
        return <AdminAppointments />;
      default:
        return <AdminProjects />;
    }
  };

  return (
    <div className="admin-dashboard fade-in">
      <div className="admin-sidebar">
        <div className="admin-logo">RASA <span>ADMIN</span></div>
        <ul className="admin-nav">
          <li 
            className={activeTab === 'projects' ? 'active' : ''} 
            onClick={() => setActiveTab('projects')}
          >
            Manage Projects
          </li>
          <li 
            className={activeTab === 'content' ? 'active' : ''} 
            onClick={() => setActiveTab('content')}
          >
            Website Content
          </li>
          <li 
            className={activeTab === 'appointments' ? 'active' : ''} 
            onClick={() => setActiveTab('appointments')}
          >
            Appointments
          </li>
          <li className="logout-btn" onClick={handleLogout}>
            Logout
          </li>
        </ul>
      </div>
      <div className="admin-content-area">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
