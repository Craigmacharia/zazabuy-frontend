import React, { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiShoppingBag, FiUser, FiMail, FiPhone } from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Checkout() {
  const [buyer, setBuyer] = useState({ 
    buyer_name: '', 
    buyer_email: '',
    buyer_phone: '' 
  });
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(items);
    
    // Pre-fill user info if available
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user) {
      setBuyer(prev => ({
        ...prev,
        buyer_name: user.name || '',
        buyer_email: user.email || '',
        buyer_phone: user.phone || ''
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBuyer({ ...buyer, [name]: value });
    
    // Clear error when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!buyer.buyer_name.trim()) newErrors.buyer_name = 'Name is required';
    if (!buyer.buyer_email.trim()) newErrors.buyer_email = 'Email is required';
    if (!buyer.buyer_phone.trim()) newErrors.buyer_phone = 'Phone is required';
    
    // Basic email validation
    if (buyer.buyer_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyer.buyer_email)) {
      newErrors.buyer_email = 'Invalid email format';
    }
    
    // Phone validation (Kenyan format)
    if (buyer.buyer_phone && !/^(\+?254|0)[17]\d{8}$/.test(buyer.buyer_phone)) {
      newErrors.buyer_phone = 'Invalid Kenyan phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = async () => {
    if (!validateForm()) return;
    
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to proceed with checkout');
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      navigate('/');
      return;
    }

    setLoading(true);

    try {
      // Create a single order with all items
      await API.post(
        '/checkout/',
        {
          items: cart.map(item => ({
            product: item.id,
            quantity: item.quantity || 1,
            price: item.price
          })),
          ...buyer
        },
        { headers: { Authorization: `Token ${token}` } }
      );
    
      toast.success('M-Pesa payment request sent! Check your phone');
      localStorage.removeItem('cart');
      navigate('/orders');
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.message || 'Checkout failed. Please try again');
    } finally {
      setLoading(false);
    }
    

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  };

  return (
    <motion.div
      className="container py-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ backgroundColor: '#F8FFE5', minHeight: '100vh' }}
    >
      <div className="row">
        <div className="col-lg-8">
          <motion.button
            className="btn d-flex align-items-center mb-4"
            onClick={() => navigate(-1)}
            whileHover={{ x: -5 }}
            style={{ color: '#06D6A0' }}
          >
            <FiArrowLeft className="me-2" />
            Back to Cart
          </motion.button>

          <div className="card border-0 shadow-sm mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}>
            <div className="card-body">
              <h3 className="mb-4" style={{ color: '#06D6A0' }}>Delivery Information</h3>
              
              <div className="mb-3">
                <label className="form-label d-flex align-items-center">
                  <FiUser className="me-2" style={{ color: '#06D6A0' }} />
                  Full Name
                </label>
                <input
                  name="buyer_name"
                  value={buyer.buyer_name}
                  onChange={handleChange}
                  className={`form-control ${errors.buyer_name ? 'is-invalid' : ''}`}
                  placeholder="John Doe"
                />
                {errors.buyer_name && <div className="invalid-feedback">{errors.buyer_name}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label d-flex align-items-center">
                  <FiMail className="me-2" style={{ color: '#06D6A0' }} />
                  Email Address
                </label>
                <input
                  type="email"
                  name="buyer_email"
                  value={buyer.buyer_email}
                  onChange={handleChange}
                  className={`form-control ${errors.buyer_email ? 'is-invalid' : ''}`}
                  placeholder="your@email.com"
                />
                {errors.buyer_email && <div className="invalid-feedback">{errors.buyer_email}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label d-flex align-items-center">
                  <FiPhone className="me-2" style={{ color: '#06D6A0' }} />
                  Phone Number (M-Pesa)
                </label>
                <input
                  type="tel"
                  name="buyer_phone"
                  value={buyer.buyer_phone}
                  onChange={handleChange}
                  className={`form-control ${errors.buyer_phone ? 'is-invalid' : ''}`}
                  placeholder="07XXXXXXXX"
                />
                {errors.buyer_phone && <div className="invalid-feedback">{errors.buyer_phone}</div>}
                <small className="text-muted">Format: 07XXXXXXXX or +2547XXXXXXXX</small>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm" style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}>
            <div className="card-body">
              <h3 className="mb-4" style={{ color: '#06D6A0' }}>Order Summary</h3>
              {cart.map(item => (
                <div key={item.id} className="d-flex justify-content-between mb-3">
                  <div>
                    <h6 className="mb-1">{item.name}</h6>
                    <small className="text-muted">Qty: {item.quantity || 1}</small>
                  </div>
                  <div className="text-end">
                    <div>Ksh {(item.price * (item.quantity || 1)).toLocaleString()}</div>
                    {item.quantity > 1 && (
                      <small className="text-muted">
                        {item.quantity} × Ksh {item.price.toLocaleString()}
                      </small>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm sticky-top" style={{ 
            top: '20px',
            backgroundColor: 'rgba(255,255,255,0.9)'
          }}>
            <div className="card-body">
              <h4 className="mb-4" style={{ color: '#06D6A0' }}>Payment Summary</h4>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal ({cart.reduce((sum, item) => sum + (item.quantity || 1), 0)} items)</span>
                <span>Ksh {calculateTotal().toLocaleString()}</span>
              </div>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Delivery</span>
                <span className="text-success">Free</span>
              </div>
              
              <hr />
              
              <div className="d-flex justify-content-between mb-4">
                <h5>Total</h5>
                <h5 style={{ color: '#06D6A0' }}>Ksh {calculateTotal().toLocaleString()}</h5>
              </div>

              <motion.button
                className="btn w-100 py-3 d-flex align-items-center justify-content-center"
                onClick={handleCheckout}
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ 
                  backgroundColor: '#06D6A0',
                  color: '#F8FFE5',
                  borderRadius: '8px',
                  fontWeight: '500',
                  border: 'none'
                }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <FiShoppingBag className="me-2" />
                    Pay with M-Pesa
                  </>
                )}
              </motion.button>
              
              <p className="text-muted mt-3 small">
                You'll receive an M-Pesa prompt on your phone to complete the payment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
}

export default Checkout;