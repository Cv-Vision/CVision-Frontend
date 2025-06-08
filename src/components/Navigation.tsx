import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{ 
      backgroundColor: '#333', 
      color: 'white', 
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.5rem' }}>
          CVision
        </Link>
      </div>
      
      <div style={{ display: 'flex', gap: '1rem' }}>
        {isAuthenticated ? (
          <>
            {user?.role === 'candidate' && (
              <>
                <Link to="/candidate/profile" style={{ color: 'white', textDecoration: 'none' }}>
                  My Profile
                </Link>
                <Link to="/jobs" style={{ color: 'white', textDecoration: 'none' }}>
                  Job Listings
                </Link>
              </>
            )}
            
            {user?.role === 'recruiter' && (
              <>
                <Link to="/recruiter/profile" style={{ color: 'white', textDecoration: 'none' }}>
                  My Profile
                </Link>
                <Link to="/recruiter/jobs" style={{ color: 'white', textDecoration: 'none' }}>
                  Manage Jobs
                </Link>
              </>
            )}
            
            <button 
              onClick={handleLogout}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '0',
                fontSize: '1rem'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>
              Login
            </Link>
            <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;