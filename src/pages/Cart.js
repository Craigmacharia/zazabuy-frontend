import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiShoppingBag, FiArrowLeft, FiPlus, FiMinus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCart = () => {
      try {
        const items = JSON.parse(localStorage.getItem('cart') || '[]');
        setCart(items);
      } catch (error) {
        toast.error('Error loading cart');
        console.error('Error loading cart:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCart();

    // Listen for cart changes from other tabs
    window.addEventListener('storage', loadCart);
    return () => window.removeEventListener('storage', loadCart);
  }, []);

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updated = [...cart];
    updated[index].quantity = newQuantity;
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    toast.success('Quantity updated');
  };

  const removeItem = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    toast.error('Item removed from cart');
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="container py-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ backgroundColor: '#F8FFE5', minHeight: '100vh' }}
    >
      <div className="row mb-4">
        <div className="col">
          <motion.button
            className="btn d-flex align-items-center"
            onClick={() => navigate(-1)}
            whileHover={{ x: -5 }}
            style={{ color: '#06D6A0' }}
          >
            <FiArrowLeft className="me-2" />
            Continue Shopping
          </motion.button>
        </div>
      </div>

      <h2 className="mb-4" style={{ color: '#06D6A0' }}>Your Shopping Cart</h2>
      
      {cart.length === 0 ? (
        <motion.div 
          className="text-center py-5"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <FiShoppingBag size={48} className="mb-3" style={{ color: '#06D6A0' }} />
          <h4 style={{ color: '#333' }}>Your cart is empty</h4>
          <motion.button
            className="btn mt-3 px-4 py-2"
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ 
              backgroundColor: '#06D6A0',
              color: '#F8FFE5',
              borderRadius: '8px',
              fontWeight: '500'
            }}
          >
            Browse Products
          </motion.button>
        </motion.div>
      ) : (
        <>
          <div className="row">
            <div className="col-lg-8">
              <AnimatePresence>
                {cart.map((item, i) => (
                  <motion.div
                    key={`${item.id}-${i}`}
                    className="card mb-3 border-0 shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
                  >
                    <div className="card-body">
                      <div className="row align-items-center">
                        <div className="col-md-2 mb-3 mb-md-0">
                          <img
                            src={item.image || '/placeholder-product.png'}
                            alt={item.name}
                            className="img-fluid rounded"
                            style={{ height: '80px', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/placeholder-product.png';
                            }}
                          />
                        </div>
                        <div className="col-md-4 mb-3 mb-md-0">
                          <h5 className="mb-1" style={{ color: '#333' }}>{item.name}</h5>
                          <small className="text-muted">{item.category || 'General'}</small>
                        </div>
                        <div className="col-md-3 mb-3 mb-md-0">
                          <div className="d-flex align-items-center">
                            <motion.button
                              className="btn p-1"
                              onClick={() => updateQuantity(i, (item.quantity || 1) - 1)}
                              whileTap={{ scale: 0.9 }}
                              style={{ color: '#06D6A0' }}
                            >
                              <FiMinus />
                            </motion.button>
                            <span className="mx-2" style={{ minWidth: '30px', textAlign: 'center' }}>
                              {item.quantity || 1}
                            </span>
                            <motion.button
                              className="btn p-1"
                              onClick={() => updateQuantity(i, (item.quantity || 1) + 1)}
                              whileTap={{ scale: 0.9 }}
                              style={{ color: '#06D6A0' }}
                            >
                              <FiPlus />
                            </motion.button>
                          </div>
                        </div>
                        <div className="col-md-2 text-md-end mb-3 mb-md-0">
                          <h6 className="m-0" style={{ color: '#06D6A0' }}>
                            Ksh {(item.price * (item.quantity || 1)).toLocaleString()}
                          </h6>
                          {item.quantity > 1 && (
                            <small className="text-muted">
                              {item.quantity} × Ksh {item.price.toLocaleString()}
                            </small>
                          )}
                        </div>
                        <div className="col-md-1 text-end">
                          <motion.button
                            className="btn p-1"
                            onClick={() => removeItem(i)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            style={{ color: '#ff4757' }}
                          >
                            <FiTrash2 />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="col-lg-4">
              <motion.div 
                className="card border-0 shadow-sm sticky-top"
                style={{ 
                  top: '20px',
                  backgroundColor: 'rgba(255,255,255,0.9)'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="card-body">
                  <h5 className="card-title mb-4" style={{ color: '#06D6A0' }}>Order Summary</h5>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal ({cart.reduce((sum, item) => sum + (item.quantity || 1), 0)} items)</span>
                    <span>Ksh {calculateTotal().toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span>Shipping</span>
                    <span className="text-success">Free</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between mb-4">
                    <h5>Total</h5>
                    <h5 style={{ color: '#06D6A0' }}>Ksh {calculateTotal().toLocaleString()}</h5>
                  </div>
                  <motion.button
                    className="btn w-100 py-3"
                    onClick={() => navigate('/checkout')}
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
                    Proceed to Checkout
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}

export default Cart;
