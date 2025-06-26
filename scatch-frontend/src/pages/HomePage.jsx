// src/pages/HomePage.jsx

import React, { useState, useEffect } from 'react';

// Component Imports
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import FilterSidebar from '../components/FilterSidebar';

// CSS Imports
import './HomePage.css';

const HomePage = ({
  products,
  loading,
  error,
  currentPage,
  totalPages,
  handlePrevPage,
  handleNextPage,
  filters,
  onFilterChange,
  onRemoveFilter,
  onClearFilters,
  totalProducts,
  sortBy,
  onSortChange,
}) => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // This useEffect handles body scroll when the filter sidebar is open
  useEffect(() => {
    document.body.style.overflow = isFilterVisible ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isFilterVisible]);

  const toggleFilterSidebar = () => setIsFilterVisible(!isFilterVisible);

  return (
    <div className="home-container">
      {/* --- Filter Sidebar Component --- */}
      {isFilterVisible && (
        <FilterSidebar
          isVisible={isFilterVisible}
          onClose={toggleFilterSidebar}
          filters={filters}
          onFilterChange={onFilterChange}
          onRemoveFilter={onRemoveFilter}
          onClearFilters={onClearFilters}
        />
      )}

      {/* --- Main Content Area (Products, Toolbar, Pagination) --- */}
      <div className="main-content-area">
        <div className="content-toolbar">
          <button className="filter-toggle-btn" onClick={toggleFilterSidebar}>
            <i className="fa-solid fa-sliders"></i>
            <span>Filter & Sort</span>
          </button>
          <p className="product-count">{totalProducts} products</p>
          <div className="sort-container">
            <label htmlFor="sort-by">Sort by</label>
            <select
              id="sort-by"
              className="sort-dropdown"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
            >
              <option value="newest-first">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* --- Loading, Error, and Product Grid Logic --- */}
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="error-display"><p>{error}</p></div>
        ) : products.length > 0 ? (
          <>
            <div className="product-grid">
              {/* The grid now directly maps over all fetched products */}
              {products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="pagination-controls">
                <button onClick={handlePrevPage} disabled={currentPage <= 1}>
                  Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage >= totalPages}>
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="no-products-found">
            <h2>No Products Found</h2>
            <p>Your search or filter criteria did not match any products.</p>
            <button className="clear-filters-btn-main" onClick={onClearFilters}>Clear All Filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;