import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = "http://localhost:3001";

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [style, setStyle] = useState('');
  const [tags, setTags] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(`${API_URL}/products/${id}`);
        const { name, price, category, brand, style, tags } = response.data;
        setName(name || '');
        setPrice(price || '');
        setCategory(category || '');
        setBrand(brand || '');
        setStyle(style || '');
        setTags(tags ? tags.join(', ') : '');
      } catch (err) {
        console.error("Failed to fetch product data:", err);
        setError("Could not load product data.");
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        name,
        price,
        category,
        brand,
        style,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      };

      await axios.put(
        `${API_URL}/products/${id}`,
        updatedData,
        { withCredentials: true }
      );
      alert("Product updated successfully!");
      navigate('/admin/dashboard');
    } catch (err) {
      console.error("Failed to update product:", err);
      alert("Error updating product.");
    }
  };

  if (loading) return <p style={{ padding: '2rem' }}>Loading product details...</p>;
  if (error) return <p style={{ padding: '2rem', color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Edit Product</h1>
      <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <div><label htmlFor="name">Product Name:</label><input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}/></div>
        <div><label htmlFor="price">Price:</label><input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}/></div>
        <div>
            <label htmlFor="category">Category (men/women):</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}>
                <option value="">Select Category</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
            </select>
        </div>
        <div><label htmlFor="brand">Brand:</label><input id="brand" type="text" value={brand} onChange={(e) => setBrand(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}/></div>
        <div><label htmlFor="style">Style:</label><input id="style" type="text" value={style} onChange={(e) => setStyle(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}/></div>
        <div><label htmlFor="tags">Tags (comma-separated):</label><input id="tags" type="text" value={tags} onChange={(e) => setTags(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}/></div>
        <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" style={{ flex: 1, padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Save Changes</button>
            <Link to="/admin/dashboard" style={{ flex: 1, textAlign: 'center', padding: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', textDecoration: 'none' }}>Cancel</Link>
        </div>
      </form>
    </div>
  );
};

export default EditProductPage;