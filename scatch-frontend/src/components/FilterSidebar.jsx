import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FilterSidebar.css';

const API_URL = "http://localhost:3001";

// A simple skeleton loader for a better UX while categories are loading
const SkeletonLoader = () => (
  <ul className="category-list">
    {[...Array(5)].map((_, i) => (
      <li key={i} className="skeleton-item">
        <div className="skeleton-text"></div>
      </li>
    ))}
  </ul>
);

// Close icon as an SVG for better control and no external dependencies
const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);


const FilterSidebar = ({ isOpen, selectedCategory, onSelectCategory, onClearFilters, onClose }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/products/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Function to handle category selection and then close the sidebar
  const handleSelect = (category) => {
    onSelectCategory(category);
    onClose(); // Close sidebar after selection for better mobile UX
  };

  return (
    <div className={`filter-sidebar-container ${isOpen ? 'is-open' : ''}`} aria-hidden={!isOpen}>
      <div className="filter-sidebar-backdrop" onClick={onClose}></div>
      
      <aside className="filter-sidebar" role="dialog" aria-modal="true">
        <div className="sidebar-header">
          <h3>Filters</h3>
          <button onClick={onClose} className="close-btn" aria-label="Close filters">
            <CloseIcon />
          </button>
        </div>
        
        <div className="sidebar-content">
          <div className="filter-group">
            <h4>Category</h4>
            <button className="clear-filters-btn" onClick={() => { onClearFilters(); onClose(); }}>
              Clear
            </button>
          </div>

          {loading ? (
            <SkeletonLoader />
          ) : (
            <ul className="category-list">
              <li
                className={!selectedCategory ? 'active' : ''}
                onClick={() => handleSelect('')}
              >
                All Products
              </li>
              {categories.map((category) => (
                <li
                  key={category}
                  className={selectedCategory === category ? 'active' : ''}
                  onClick={() => handleSelect(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
};

export default FilterSidebar;