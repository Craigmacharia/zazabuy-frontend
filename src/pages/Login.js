import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiLock } from 'react-icons/fi';
import { Link } from 'react-router-dom';

function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/login/', credentials);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{
      minHeight: '100vh',
      backgroundColor: '#F8FFE5',
      backgroundImage: 'linear-gradient(to bottom right, #F8FFE5 0%, #e6f7e1 100%)'
    }}>
      <div className="card border-0 shadow-lg" style={{
        width: '100%',
        maxWidth: '500px',
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(6, 214, 160, 0.1)'
      }}>
        <div className="card-body p-5">
          <h2 className="text-center mb-4" style={{ 
            color: '#06D6A0',
            fontWeight: '600',
            letterSpacing: '0.5px'
          }}>
            Welcome Back
          </h2>
          
          {error && (
            <div className="alert alert-danger" style={{
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'rgba(220, 53, 69, 0.1)',
              color: '#dc3545',
              padding: '12px'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="form-label d-flex align-items-center" style={{ 
                color: '#555',
                fontWeight: '500',
                marginBottom: '8px'
              }}>
                <FiUser className="me-2" style={{ color: '#06D6A0' }} />
                Username
              </label>
              <input
                name="username"
                className="form-control"
                onChange={handleChange}
                required
                style={{
                  borderRadius: '10px',
                  padding: '12px 15px',
                  border: '2px solid #eee',
                  transition: 'all 0.3s',
                  fontSize: '15px'
                }}
                onFocus={(e) => e.target.style.borderColor = '#06D6A0'}
                onBlur={(e) => e.target.style.borderColor = '#eee'}
              />
            </div>

            <div className="mb-4">
              <label className="form-label d-flex align-items-center" style={{ 
                color: '#555',
                fontWeight: '500',
                marginBottom: '8px'
              }}>
                <FiLock className="me-2" style={{ color: '#06D6A0' }} />
                Password
              </label>
              <input
                name="password"
                type="password"
                className="form-control"
                onChange={handleChange}
                required
                style={{
                  borderRadius: '10px',
                  padding: '12px 15px',
                  border: '2px solid #eee',
                  transition: 'all 0.3s',
                  fontSize: '15px'
                }}
                onFocus={(e) => e.target.style.borderColor = '#06D6A0'}
                onBlur={(e) => e.target.style.borderColor = '#eee'}
              />
            </div>

            <button
              type="submit"
              className="btn w-100 py-3 mt-3"
              style={{
                backgroundColor: '#06D6A0',
                color: '#fff',
                borderRadius: '10px',
                fontWeight: '600',
                border: 'none',
                transition: 'all 0.3s',
                fontSize: '16px',
                letterSpacing: '0.5px',
                boxShadow: '0 4px 15px rgba(6, 214, 160, 0.3)'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Login
            </button>
          </form>

          <div className="text-center mt-4" style={{ color: '#777' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{
              color: '#06D6A0',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'all 0.3s',
              borderBottom: '1px dashed transparent'
            }}
            onMouseOver={(e) => e.target.style.borderBottomColor = '#06D6A0'}
            onMouseOut={(e) => e.target.style.borderBottomColor = 'transparent'}
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;