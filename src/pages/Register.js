import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import { Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/register/', formData);
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Try a different username or email.');
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
            Create Account
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

          <form onSubmit={handleSubmit}>
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
                type="text"
                className="form-control"
                required
                onChange={handleChange}
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
                <FiMail className="me-2" style={{ color: '#06D6A0' }} />
                Email
              </label>
              <input
                name="email"
                type="email"
                className="form-control"
                required
                onChange={handleChange}
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
                required
                onChange={handleChange}
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
              Register
            </button>
          </form>

          <div className="text-center mt-4" style={{ color: '#777' }}>
            Already have an account?{' '}
            <Link to="/login" style={{
              color: '#06D6A0',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'all 0.3s',
              borderBottom: '1px dashed transparent'
            }}
            onMouseOver={(e) => e.target.style.borderBottomColor = '#06D6A0'}
            onMouseOut={(e) => e.target.style.borderBottomColor = 'transparent'}
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;