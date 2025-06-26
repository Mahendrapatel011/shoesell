// src/components/ProductCard.jsx

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { axiosInstance, AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './ProductCard.css'; // The new CSS we just created

const ProductCard = ({ product, cardColor }) => {
  const { user } = useContext(AuthContext);

  if (!product) {
    return null;
  }

  // Use the passed color, or a default fallback
  const backgroundColor = cardColor || '#f0f4f8';
  
  const imageUrl = `http://localhost:3001/images/uploads/${product.image}`;

  const handleAddToCart = async (event) => {
    // These two lines are crucial. They stop the click from
    // navigating to the product page when only the button is clicked.
    event.stopPropagation();
    event.preventDefault();

    if (!user) {
      toast.info("Please log in to add items to your cart.");
      return;
    }
    
    try {
      await axiosInstance.post(`/users/cart/add/${product._id}`);
      toast.success(`${product.name} added to cart!`);
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error(error.response?.data || "Failed to add product.");
    }
  };

  return (
    // The entire card is a link, with the background color applied here
    <Link 
      to={`/product/${product._id}`} 
      className="product-card" 
      style={{ backgroundColor: backgroundColor }}
    >
      <img src={imageUrl} alt={product.name} className="product-image" />
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">₹{product.price.toLocaleString('en-IN')}</p>
      </div>

      {user && (
        <button onClick={handleAddToCart} className="add-to-cart-button">
          +
        </button>
      )}
    </Link>
  );
};

export default ProductCard;