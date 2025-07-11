import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiLoader } from 'react-icons/fi';

function ProductCard({ product, onAddToCart, isLoading = false }) {
  const handleAddToCart = (e) => {
    e.preventDefault();
    if (onAddToCart && !isLoading) {
      onAddToCart(product);
    }
  };

  // Format price with commas for thousands
  const formattedPrice = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
  }).format(product.price);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    },
    hover: { y: -5 }
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.98 }
  };

  return (
    <motion.div
      className="card h-100 border-0"
      style={{ 
        backgroundColor: '#F8FFE5', // Light yellow background
        boxShadow: '0 4px 12px rgba(6, 214, 160, 0.1)' // Emerald shadow
      }}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      variants={cardVariants}
      data-testid="product-card"
    >
      {product.image ? (
        <motion.div 
          className="overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <img
            src={product.image}
            alt={product.name}
            className="card-img-top img-fluid"
            style={{ 
              height: '200px', 
              objectFit: 'cover',
              width: '100%',
              transition: 'transform 0.3s ease'
            }}
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = '/placeholder-product.png';
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
        </motion.div>
      ) : (
        <div 
          className="bg-light d-flex align-items-center justify-content-center" 
          style={{ height: '200px', backgroundColor: 'rgba(6, 214, 160, 0.1)' }}
        >
          <span className="text-muted">No image available</span>
        </div>
      )}
      
      <div className="card-body d-flex flex-column p-3">
        <div className="mb-3">
          <h5 
            className="card-title fw-semibold" 
            style={{ 
              minHeight: '3rem',
              color: '#333'
            }}
          >
            {product.name}
          </h5>
          <p 
            className="card-text mb-2" 
            style={{ 
              fontSize: '0.9rem', 
              minHeight: '3rem',
              color: '#666'
            }}
          >
            {product.description || 'No description available'}
          </p>
          <h6 
            className="fw-bold mb-3"
            style={{ color: '#06D6A0' }} // Emerald color
          >
            {formattedPrice}
          </h6>
        </div>
        
        <motion.button
          className="btn mt-auto d-flex align-items-center justify-content-center gap-2"
          style={{ 
            backgroundColor: '#06D6A0', // Emerald button
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 16px'
          }}
          onClick={handleAddToCart}
          disabled={isLoading}
          aria-label={`Add ${product.name} to cart`}
          variants={buttonVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
        >
          {isLoading ? (
            <>
              <FiLoader className="spin" />
              <span>Adding...</span>
            </>
          ) : (
            <>
              <FiShoppingCart />
              <span>Add to Cart</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.number.isRequired,
    image: PropTypes.string,
  }).isRequired,
  onAddToCart: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default ProductCard;
