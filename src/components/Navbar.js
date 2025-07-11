import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiUser, FiLogOut, FiLogIn, FiUserPlus } from 'react-icons/fi';

function Navbar() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Update token state when it changes
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <motion.nav 
      className="navbar navbar-expand-lg px-4 py-3"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ 
        backgroundColor: '#06D6A0',
        boxShadow: '0 2px 10px rgba(6, 214, 160, 0.2)'
      }}
    >
      <div className="container-fluid">
        <Link 
          className="navbar-brand fw-bold d-flex align-items-center" 
          to="/"
          style={{ color: '#F8FFE5', fontSize: '1.5rem' }}
        >
          ZazaBuy
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          style={{ borderColor: '#F8FFE5' }}
        >
          <span className="navbar-toggler-icon" style={{ color: '#F8FFE5' }}></span>
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <motion.li 
              className="nav-item"
              whileHover={{ scale: 1.05 }}
            >
              <Link 
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                to="/"
                style={{ 
                  color: '#F8FFE5',
                  fontWeight: location.pathname === '/' ? '600' : '400'
                }}
              >
                Home
              </Link>
            </motion.li>
            <motion.li 
              className="nav-item"
              whileHover={{ scale: 1.05 }}
            >
              <Link 
                className={`nav-link ${location.pathname === '/cart' ? 'active' : ''}`}
                to="/cart"
                style={{ 
                  color: '#F8FFE5',
                  fontWeight: location.pathname === '/cart' ? '600' : '400'
                }}
              >
                <div className="d-flex align-items-center">
                  <FiShoppingCart className="me-1" />
                  Cart
                </div>
              </Link>
            </motion.li>
          </ul>

          <ul className="navbar-nav">
            {token ? (
              <>
                <motion.li 
                  className="nav-item mx-1"
                  whileHover={{ scale: 1.05 }}
                >
                  <Link 
                    className="nav-link d-flex align-items-center"
                    to="/profile"
                    style={{ color: '#F8FFE5' }}
                  >
                    <FiUser className="me-1" />
                    Profile
                  </Link>
                </motion.li>
                <motion.li 
                  className="nav-item mx-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button 
                    className="btn btn-sm d-flex align-items-center"
                    onClick={handleLogout}
                    style={{ 
                      backgroundColor: 'rgba(248, 255, 229, 0.2)',
                      color: '#F8FFE5',
                      border: 'none'
                    }}
                  >
                    <FiLogOut className="me-1" />
                    Logout
                  </button>
                </motion.li>
              </>
            ) : (
              <>
                <motion.li 
                  className="nav-item mx-1"
                  whileHover={{ scale: 1.05 }}
                >
                  <Link 
                    className="btn btn-sm d-flex align-items-center"
                    to="/register"
                    style={{ 
                      backgroundColor: 'rgba(248, 255, 229, 0.2)',
                      color: '#F8FFE5',
                      border: 'none'
                    }}
                  >
                    <FiUserPlus className="me-1" />
                    Register
                  </Link>
                </motion.li>
                <motion.li 
                  className="nav-item mx-1"
                  whileHover={{ scale: 1.05 }}
                >
                  <Link 
                    className="btn btn-sm d-flex align-items-center"
                    to="/login"
                    style={{ 
                      backgroundColor: '#F8FFE5',
                      color: '#06D6A0',
                      fontWeight: '500'
                    }}
                  >
                    <FiLogIn className="me-1" />
                    Login
                  </Link>
                </motion.li>
              </>
            )}
          </ul>
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;
