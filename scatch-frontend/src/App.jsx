import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Routes, Route } from 'react-router-dom';
import './App.css';


import { ToastContainer } from 'react-toastify';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Page Imports
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import CartPage from './pages/CartPage';
import ProductDetailPage from './pages/ProductDetailPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import MyOrders from './pages/MyOrders';
import ProfilePage from './pages/ProfilePage';

// Owner Imports
import OwnerLoginPage from './pages/OwnerLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import EditProductPage from './pages/EditProductPage';

// Protected Route Imports
import OwnerProtectedRoute from './utils/OwnerProtectedRoute';
import UserProtectedRoute from './utils/UserProtectedRoute';

const API_URL = "http://localhost:3001";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    style: '',
    brand: '',
    tag: ''
  });

  const [sortBy, setSortBy] = useState('newest-first');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const fetchProducts = useCallback(async () => {
    setLoading(true); 
    try {
      const params = {
        page: currentPage,
        sortBy: sortBy,
        limit: 12,
      };
      for (const key in filters) {
        if (filters[key]) {
          params[key] = filters[key];
        }
      }
      
      const response = await axios.get(`${API_URL}/products`, { params });
      
      setProducts(response.data.products); 
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
      setTotalProducts(response.data.totalProducts);
      setError(null);
    } catch (err) {
      setError("Failed to fetch products. Is the backend server running?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage, sortBy]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFilterChange = (filterType, value) => {
    setCurrentPage(1);
    setFilters(() => {
        const newFilters = { search: '', category: '', style: '', brand: '', tag: '' };
        newFilters[filterType] = value;
        return newFilters;
    });
  };
  
  const removeFilter = (filterTypeToRemove) => {
    setCurrentPage(1);
    setFilters(prev => ({ ...prev, [filterTypeToRemove]: '' }));
  };

  const clearAllFilters = () => {
    setCurrentPage(1);
    setFilters({ search: '', category: '', style: '', brand: '', tag: '' });
    setSortBy('newest-first');
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(1);
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const refreshProductsForAdmin = () => {
    clearAllFilters();
  };

  return (
    <div className="site-container">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Navbar 
        onSearch={(term) => handleFilterChange('search', term)} 
        searchQuery={filters.search} 
        handleFilterChange={handleFilterChange}
      />
      <main className="app-container">
        <Routes>
          <Route 
            path="/" 
            element={
              <HomePage 
                products={products} 
                loading={loading} 
                error={error}
                currentPage={currentPage}
                totalPages={totalPages}
                totalProducts={totalProducts}
                handlePrevPage={handlePrevPage}
                handleNextPage={handleNextPage}
                sortBy={sortBy}
                onSortChange={handleSortChange}
                filters={filters}
                onClearFilters={clearAllFilters}
                onRemoveFilter={removeFilter}
              />
            } 
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<UserProtectedRoute><CartPage /></UserProtectedRoute>} />
          <Route path="/order/success/:orderId" element={<UserProtectedRoute><OrderSuccessPage /></UserProtectedRoute>} />
          <Route path="/my-orders" element={<UserProtectedRoute><MyOrders /></UserProtectedRoute>} />
          <Route path="/profile" element={<UserProtectedRoute><ProfilePage /></UserProtectedRoute>} />
          <Route path="/owner/login" element={<OwnerLoginPage />} />
          <Route path="/admin/dashboard" element={<OwnerProtectedRoute><AdminDashboard onProductCreated={refreshProductsForAdmin} /></OwnerProtectedRoute>} />
          <Route path="/admin/edit-product/:id" element={<OwnerProtectedRoute><EditProductPage /></OwnerProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;