import React, { useEffect, useState } from 'react';
import API from '../api';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTruck, FiSmartphone, FiShield, FiSearch, FiFilter, FiChevronRight, FiMail, FiShoppingCart, FiHeart } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState(['all']);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get('/products/');
        const productData = response.data || [];
        setProducts(productData);
        
        const productCategories = productData.map(p => p?.category || 'uncategorized');
        const uniqueCategories = [...new Set(productCategories)].filter(Boolean);
        setCategories(['all', ...uniqueCategories]);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product) => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = cart.find(item => item?.id === product?.id);
      
      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
      } else {
        cart.push({ 
          ...product, 
          quantity: 1 
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      setCartPulse(true);
      setTimeout(() => setCartPulse(false), 1000);
      
      // Floating cart confirmation
      const notification = document.createElement('div');
      notification.innerHTML = `
        <div style="
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: #06D6A0;
          color: white;
          padding: 15px 25px;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          z-index: 1000;
          animation: floatIn 0.5s ease-out;
        ">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="font-size: 1.5rem;">🎉</div>
            <div>
              <strong>${product?.name || 'Item'}</strong> added to cart!
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => {
        notification.style.animation = 'floatOut 0.5s ease-in';
        setTimeout(() => notification.remove(), 500);
      }, 3000);
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 5000);
      setEmail('');
    }
  };

  const filteredProducts = products.filter(product => {
    const name = product?.name?.toLowerCase() || '';
    const description = product?.description?.toLowerCase() || '';
    const category = product?.category || 'uncategorized';
    
    const matchesSearch = name.includes(searchTerm.toLowerCase()) || 
                         description.includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const saleProducts = products.filter(p => (p?.discount || 0) > 0).slice(0, 4);

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } }
  };

  const slides = [
    { id: 1, image: '/itel.png', title: 'Tech Revolution', subtitle: 'Premium gadgets at unbeatable prices', cta: 'Shop Now' },
    { id: 2, image: '/oraimo.png', title: 'M-Pesa Special', subtitle: 'Extra 5% cashback on all payments', cta: 'Get Deal' },
    { id: 3, image: '/mac.png', title: 'New Arrivals', subtitle: 'Cutting-edge technology just landed', cta: 'Explore' }
  ];

  const formatCategoryName = (category) => {
    if (!category) return '';
    return category === 'all' ? 'All Categories' : 
      category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  };

  return (
    <div style={{ backgroundColor: '#F8FFE5', minHeight: '100vh' }}>
      {/* Add floating cart icon */}
      <motion.div
        className="position-fixed d-flex align-items-center justify-content-center"
        style={{
          top: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          backgroundColor: '#06D6A0',
          color: '#F8FFE5',
          borderRadius: '50%',
          zIndex: 1000,
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(6, 214, 160, 0.4)'
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ 
          scale: cartPulse ? [1, 1.2, 1] : 1,
          transition: { duration: 0.5 }
        }}
      >
        <FiShoppingCart size={24} />
        <motion.span 
          className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{ fontSize: '0.7rem' }}
        >
          {JSON.parse(localStorage.getItem('cart') || '[]').length}

        </motion.span>
      </motion.div>

      {/* Hero Slideshow */}
      <motion.section 
        className="position-relative"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          navigation={{ 
            nextEl: '.swiper-button-next', 
            prevEl: '.swiper-button-prev'
          }}
          loop={true}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={slide.id}>
              <div 
                className="d-flex align-items-center justify-content-center" 
                style={{
                  height: '70vh',
                  minHeight: '400px',
                  backgroundImage: `linear-gradient(rgba(6, 214, 160, 0.3), rgba(6, 214, 160, 0.3)), url(${slide.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="text-center text-white px-3" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>
                  <motion.h2 
                    className="display-4 fw-bold mb-3"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {slide.title}
                  </motion.h2>
                  <motion.p 
                    className="fs-3 mb-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {slide.subtitle}
                  </motion.p>
                  <motion.button
                    className="btn btn-lg px-4 py-2"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: '0 5px 15px rgba(248, 255, 229, 0.4)'
                    }}
                    whileTap={{ scale: 0.95 }}
                    style={{ 
                      backgroundColor: '#F8FFE5',
                      color: '#06D6A0',
                      fontWeight: '600',
                      letterSpacing: '0.5px'
                    }}
                  >
                    {slide.cta}
                  </motion.button>
                </div>
              </div>
              <div className="position-absolute bottom-0 start-0 w-100 text-center pb-3">
                {slides.map((_, i) => (
                  <motion.span
                    key={i}
                    className="d-inline-block mx-1 rounded-pill"
                    style={{
                      width: i === index ? '30px' : '10px',
                      height: '6px',
                      backgroundColor: i === index ? '#F8FFE5' : 'rgba(248, 255, 229, 0.5)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    whileHover={{ backgroundColor: '#F8FFE5' }}
                  />
                ))}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.section>

      {/* Search and Filter */}
      <motion.section 
        className="container py-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="row g-3 justify-content-center">
          <div className="col-lg-8 col-md-10">
            <div className="input-group shadow-lg" style={{ borderRadius: '12px', overflow: 'hidden' }}>
              <span 
                className="input-group-text border-0" 
                style={{ 
                  backgroundColor: '#06D6A0', 
                  color: '#F8FFE5',
                }}
              >
                <FiSearch size={20} />
              </span>
              <input
                type="text"
                className="form-control border-0 py-3"
                placeholder="Search for gadgets, devices, and more..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ 
                  backgroundColor: 'rgba(255,255,255,0.9)',
                }}
              />
              <motion.button
                className="btn border-0"
                style={{ 
                  backgroundColor: '#06D6A0',
                  color: '#F8FFE5',
                  fontWeight: '600'
                }}
                whileHover={{ backgroundColor: '#05c191' }}
              >
                Search
              </motion.button>
            </div>
          </div>
          <div className="col-lg-4 col-md-8">
            <div className="input-group shadow-lg" style={{ borderRadius: '12px', overflow: 'hidden' }}>
              <span 
                className="input-group-text border-0" 
                style={{ 
                  backgroundColor: '#06D6A0', 
                  color: '#F8FFE5',
                }}
              >
                <FiFilter size={20} />
              </span>
              <select
                className="form-select border-0 py-3"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ 
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  cursor: 'pointer'
                }}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {formatCategoryName(category)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Error State */}
      {error && (
        <div className="container py-5 text-center">
          <motion.div 
            className="alert alert-danger d-inline-block"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ 
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 4px 12px rgba(220, 53, 69, 0.2)'
            }}
          >
            {error}
            <motion.button 
              className="btn btn-sm ms-3" 
              onClick={() => window.location.reload()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ 
                backgroundColor: '#06D6A0', 
                color: '#F8FFE5',
                borderRadius: '8px'
              }}
            >
              Retry
            </motion.button>
          </motion.div>
        </div>
      )}

      {/* Special Offers */}
      {!error && saleProducts.length > 0 && (
        <motion.section 
          className="container py-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="d-flex justify-content-between align-items-center mb-4 px-2">
            <motion.h2 
              className="m-0"
              style={{ 
                color: '#06D6A0', 
                fontWeight: '700',
                textShadow: '1px 1px 3px rgba(6, 214, 160, 0.2)'
              }}
              whileHover={{ scale: 1.02 }}
            >
              Hot Deals 🔥
            </motion.h2>
            <motion.a 
              href="#"
              whileHover={{ x: 5 }}
              style={{ 
                color: '#06D6A0',
                textDecoration: 'none',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              View All <FiChevronRight />
            </motion.a>
          </div>
          <div className="row g-4">
            {saleProducts.map(p => (
              <div className="col-xl-3 col-lg-4 col-md-6" key={p.id || Math.random()}>
                <motion.div 
                  className="card h-100 border-0 shadow-sm overflow-hidden"
                  whileHover={{ 
                    y: -5,
                    boxShadow: '0 10px 20px rgba(6, 214, 160, 0.2)'
                  }}
                  style={{ 
                    borderRadius: '16px',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div className="position-relative">
                    <div 
                      className="position-absolute top-0 start-0 px-3 py-1 m-2 rounded-pill"
                      style={{ 
                        backgroundColor: '#FF4757',
                        color: 'white',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                      }}
                    >
                      {p.discount}% OFF
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <img
                        src={p.image || '/placeholder-product.png'}
                        alt={p.name || 'Product image'}
                        className="img-fluid w-100"
                        style={{ 
                          height: '200px', 
                          objectFit: 'cover',
                          borderTopLeftRadius: '16px',
                          borderTopRightRadius: '16px',
                          transition: 'transform 0.5s ease'
                        }}
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder-product.png';
                        }}
                      />
                    </motion.div>
                    <motion.button
                      className="position-absolute top-0 end-0 m-2 p-2 d-flex align-items-center justify-content-center"
                      style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        color: '#FF4757',
                        borderRadius: '50%',
                        border: 'none',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                      }}
                      whileHover={{ scale: 1.1, color: '#FF4757' }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FiHeart size={18} />
                    </motion.button>
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title" style={{ color: '#333' }}>
                      {p.name || 'Unnamed Product'}
                    </h5>
                    <div className="d-flex align-items-center mb-2">
                      <span 
                        className="text-decoration-line-through me-2" 
                        style={{ color: '#999', fontSize: '0.9rem' }}
                      >
                        Ksh {p.price?.toLocaleString() || '0'}
                      </span>
                      <span style={{ color: '#06D6A0', fontWeight: '600' }}>
                        Ksh {((p.price || 0) * (1 - (p.discount || 0)/100)).toLocaleString()}
                      </span>
                    </div>
                    <motion.button
                      className="btn mt-auto w-100 py-2"
                      onClick={() => addToCart(p)}
                      whileHover={{ 
                        scale: 1.02,
                        boxShadow: '0 5px 15px rgba(6, 214, 160, 0.3)'
                      }}
                      whileTap={{ scale: 0.98 }}
                      style={{ 
                        backgroundColor: '#06D6A0',
                        color: '#F8FFE5',
                        borderRadius: '8px',
                        fontWeight: '500',
                        border: 'none'
                      }}
                    >
                      Add to Cart
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Features */}
      {!error && (
        <motion.section 
          className="py-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          style={{ 
            backgroundColor: 'rgba(6, 214, 160, 0.1)',
            background: 'linear-gradient(135deg, rgba(6, 214, 160, 0.1) 0%, rgba(248, 255, 229, 0.3) 100%)'
          }}
        >
          <div className="container">
            <motion.h2 
              className="text-center mb-5"
              style={{ 
                color: '#06D6A0',
                position: 'relative',
                display: 'inline-block',
                left: '50%',
                transform: 'translateX(-50%)'
              }}
              whileHover={{ scale: 1.05 }}
            >
              <span style={{
                display: 'inline-block',
                padding: '0 20px',
                backgroundColor: '#F8FFE5',
                zIndex: 1,
                position: 'relative'
                
              }}>
              
              </span>
              
              <span style={{
                position: 'absolute',
                bottom: '8px',
                left: 0,
                right: 0,
                height: '10px',
                backgroundColor: 'rgba(6, 214, 160, 0.2)',
                zIndex: 0,
                borderRadius: '5px'
              }}></span>
            </motion.h2>
            <div className="row g-4">
              {[
                { icon: <FiTruck size={32} />, title: "Fast Delivery", text: "Nationwide shipping in 24-48 hours" },
                { icon: <FiSmartphone size={32} />, title: "M-Pesa Payments", text: "Secure mobile money transactions" },
                { icon: <FiShield size={32} />, title: "1-Year Warranty", text: "All products come with warranty" },
                { icon: <FiMail size={32} />, title: "24/7 Support", text: "Dedicated customer care team" }
              ].map((feature, index) => (
                <div className="col-md-3 col-6" key={index}>
                  <motion.div 
                    className="text-center p-4 h-100"
                    whileHover={{ 
                      y: -5,
                      boxShadow: '0 10px 20px rgba(6, 214, 160, 0.15)'
                    }}
                    style={{ 
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      borderRadius: '16px',
                      boxShadow: '0 4px 12px rgba(6, 214, 160, 0.1)',
                      border: '1px solid rgba(6, 214, 160, 0.1)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <motion.div 
                      className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                      style={{
                        width: '70px',
                        height: '70px',
                        backgroundColor: '#06D6A0',
                        color: '#F8FFE5',
                        borderRadius: '50%',
                        boxShadow: '0 4px 10px rgba(6, 214, 160, 0.3)'
                      }}
                      whileHover={{ rotate: 10, scale: 1.1 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <h5 style={{ color: '#06D6A0', fontWeight: '600' }}>{feature.title}</h5>
                    <p className="text-muted m-0" style={{ fontSize: '0.9rem' }}>{feature.text}</p>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Product Grid */}
      {!error && (
        <motion.section 
          className="container py-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <motion.h2 
            className="text-center mb-5"
            style={{ 
              color: '#06D6A0',
              position: 'relative',
              display: 'inline-block',
              left: '50%',
              transform: 'translateX(-50%)'
            }}
            whileHover={{ scale: 1.05 }}
          >
            <span style={{
              display: 'inline-block',
              padding: '0 20px',
              backgroundColor: '#F8FFE5',
              zIndex: 1,
              position: 'relative'
            }}>
              Our Products
            </span>
            <span style={{
              position: 'absolute',
              bottom: '8px',
              left: 0,
              right: 0,
              height: '10px',
              backgroundColor: 'rgba(6, 214, 160, 0.2)',
              zIndex: 0,
              borderRadius: '5px'
            }}></span>
          </motion.h2>
          {loading ? (
            <div className="text-center py-5">
              <motion.div
                animate={{ 
                  rotate: 360,
                  transition: { 
                    duration: 1, 
                    repeat: Infinity, 
                    ease: "linear" 
                  } 
                }}
                style={{
                  width: '60px',
                  height: '60px',
                  border: '5px solid rgba(6, 214, 160, 0.2)',
                  borderTopColor: '#06D6A0',
                  borderRadius: '50%',
                  display: 'inline-block'
                }}
              />
              <motion.p 
                className="mt-3"
                style={{ color: '#06D6A0', fontWeight: '500' }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Loading amazing products...
              </motion.p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="row g-4">
              {filteredProducts.map(p => (
                <div className="col-xl-3 col-lg-4 col-md-6" key={p.id || Math.random()}>
                  <ProductCard product={p} onAddToCart={addToCart} />
                </div>
              ))}
            </div>
          ) : (
            <motion.div 
              className="text-center py-5"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="mb-4" style={{ fontSize: '5rem' }}>🔍</div>
              <h4 style={{ color: '#333' }}>No products found matching your criteria</h4>
              <motion.button
                className="btn mt-3 px-4 py-2"
                onClick={() => { 
                  setSearchTerm(''); 
                  setSelectedCategory('all'); 
                }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 5px 15px rgba(6, 214, 160, 0.3)'
                }}
                whileTap={{ scale: 0.95 }}
                style={{ 
                  backgroundColor: '#06D6A0',
                  color: '#F8FFE5',
                  borderRadius: '8px',
                  fontWeight: '500'
                }}
              >
                Reset Filters
              </motion.button>
            </motion.div>
          )}
        </motion.section>
      )}

      {/* Newsletter */}
      {!error && (
        <motion.section 
          className="py-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          style={{ 
            backgroundColor: '#06D6A0',
            background: 'linear-gradient(135deg, #06D6A0 0%, #05c191 100%)'
          }}
        >
          <div className="container text-center text-white">
            <motion.h2 
              className="mb-3"
              whileHover={{ scale: 1.02 }}
            >
              Join Our Tech Community
            </motion.h2>
            <motion.p 
              className="mb-4" 
              style={{ opacity: 0.9 }}
              whileHover={{ scale: 1.01 }}
            >
              Subscribe to get exclusive deals, tech news, and 10% off your first order!
            </motion.p>
            <AnimatePresence>
              {isSubscribed ? (
                <motion.div
                  key="success"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="alert alert-success d-inline-block"
                  style={{ 
                    backgroundColor: '#F8FFE5', 
                    color: '#06D6A0',
                    borderRadius: '12px',
                    boxShadow: '0 5px 15px rgba(248, 255, 229, 0.3)'
                  }}
                >
                  Thanks for subscribing! Check your email for confirmation.
                </motion.div>
              ) : (
                <motion.form 
                  key="form"
                  onSubmit={handleNewsletterSubmit}
                  className="row justify-content-center"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="col-md-6">
                    <div className="input-group mb-3 shadow-lg" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                      <input
                        type="email"
                        className="form-control border-0 py-3"
                        placeholder="Your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ 
                          backgroundColor: 'rgba(255,255,255,0.9)',
                        }}
                      />
                      <motion.button
                        className="btn border-0 py-3 px-4"
                        type="submit"
                        whileHover={{ backgroundColor: '#F8FFE5', color: '#06D6A0' }}
                        style={{ 
                          backgroundColor: '#F8FFE5',
                          color: '#06D6A0',
                          fontWeight: '600',
                        }}
                      >
                        Subscribe
                      </motion.button>
                    </div>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.section>
      )}

      {/* Footer */}
      <motion.footer 
        className="py-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        style={{ 
          backgroundColor: 'rgba(6, 214, 160, 0.9)', 
          color: '#F8FFE5',
          background: 'linear-gradient(135deg, rgba(6, 214, 160, 0.9) 0%, rgba(5, 193, 145, 0.9) 100%)'
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-4 mb-md-0">
              <motion.h5 
                className="mb-3"
                whileHover={{ x: 5 }}
              >
                ZazaBuy
              </motion.h5>
              <p>Your trusted tech partner in Kenya. Quality gadgets at affordable prices.</p>
              <motion.div 
                className="d-flex gap-3 mt-3"
                whileHover={{ scale: 1.05 }}
              >
                {['Facebook', 'Twitter', 'Instagram'].map((social, i) => (
                  <motion.a 
                    key={i} 
                    href="#" 
                    className="d-flex align-items-center justify-content-center"
                    whileHover={{ y: -3 }}
                    style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: 'rgba(248, 255, 229, 0.2)',
                      color: '#F8FFE5',
                      borderRadius: '50%',
                      textDecoration: 'none'
                    }}
                  >
                    {social.charAt(0)}
                  </motion.a>
                ))}
              </motion.div>
            </div>
            <div className="col-md-2 mb-4 mb-md-0">
              <h5 className="mb-3">Shop</h5>
              <ul className="list-unstyled">
                <motion.li 
                  className="mb-2"
                  whileHover={{ x: 5 }}
                >
                  <a href="/home" style={{ color: '#F8FFE5', textDecoration: 'none' }}>All Products</a>
                </motion.li>
                <motion.li 
                  className="mb-2"
                  whileHover={{ x: 5 }}
                >
                  <a href="/home" style={{ color: '#F8FFE5', textDecoration: 'none' }}>New Arrivals</a>
                </motion.li>
                <motion.li 
                  className="mb-2"
                  whileHover={{ x: 5 }}
                >
                  <a href="/home" style={{ color: '#F8FFE5', textDecoration: 'none' }}>Special Offers</a>
                </motion.li>
              </ul>
            </div>
            <div className="col-md-3 mb-4 mb-md-0">
              <h5 className="mb-3">Support</h5>
              <ul className="list-unstyled">
                <motion.li 
                  className="mb-2"
                  whileHover={{ x: 5 }}
                >
                  <a href="home" style={{ color: '#F8FFE5', textDecoration: 'none' }}>Contact Us</a>
                </motion.li>
                <motion.li 
                  className="mb-2"
                  whileHover={{ x: 5 }}
                >
                  <a href="/home" style={{ color: '#F8FFE5', textDecoration: 'none' }}>FAQs</a>
                </motion.li>
                <motion.li 
                  className="mb-2"
                  whileHover={{ x: 5 }}
                >
                  <a href="/home" style={{ color: '#F8FFE5', textDecoration: 'none' }}>Shipping Policy</a>
                </motion.li>
              </ul>
            </div>
            <div className="col-md-3">
              <h5 className="mb-3">Newsletter</h5>
              <p>Stay updated with our latest offers</p>
              <div className="input-group">
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="Your email" 
                  style={{ 
                    backgroundColor: 'rgba(248, 255, 229, 0.9)',
                    border: 'none',
                    borderRadius: '8px 0 0 8px'
                  }}
                />
                <motion.button
                  className="btn"
                  style={{ 
                    backgroundColor: '#F8FFE5',
                    color: '#06D6A0',
                    borderRadius: '0 8px 8px 0',
                    border: 'none'
                  }}
                  whileHover={{ backgroundColor: '#06D6A0', color: '#F8FFE5' }}
                >
                  <FiMail />
                </motion.button>
              </div>
            </div>
          </div>
          <motion.hr 
            style={{ 
              borderColor: 'rgba(248, 255, 229, 0.2)',
              margin: '2rem 0'
            }}
            whileInView={{ width: ['0%', '100%'] }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          />
          <div className="text-center pt-2">
            <motion.small
              whileHover={{ scale: 1.05 }}
            >
              &copy; {new Date().getFullYear()} ZazaBuy. All rights reserved. 
              <span className="d-block d-md-inline"> Built with ❤️ in Kenya</span>
            </motion.small>
          </div>
        </div>
      </motion.footer>

      {/* Add some floating decorative elements */}
      <motion.div
        className="position-fixed"
        style={{
          top: '20%',
          left: '5%',
          width: '100px',
          height: '100px',
          backgroundColor: 'rgba(6, 214, 160, 0.1)',
          borderRadius: '50%',
          zIndex: -1
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="position-fixed"
        style={{
          bottom: '10%',
          right: '5%',
          width: '150px',
          height: '150px',
          backgroundColor: 'rgba(6, 214, 160, 0.1)',
          borderRadius: '50%',
          zIndex: -1
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.15, 0.1]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
    </div>
  );
}

export default Home;

