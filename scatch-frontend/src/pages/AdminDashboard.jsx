import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = "http://localhost:3001";

const AdminDashboard = ({ onProductCreated }) => {
  const navigate = useNavigate();

  // States for the create form
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [style, setStyle] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState(null);
  
  // States for displaying data
  const [ownerProducts, setOwnerProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState(null);
  const [ownerOrders, setOwnerOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState(null);
  const [orderStatuses, setOrderStatuses] = useState({});

  const fetchOwnerProducts = async () => {
    setLoadingProducts(true);
    try {
      const response = await axios.get(`${API_URL}/products/owner`, { withCredentials: true });
      setOwnerProducts(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching owner's products:", err);
      setError("Could not fetch your products.");
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchOwnerOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await axios.get(`${API_URL}/owners/orders`, { withCredentials: true });
      setOwnerOrders(response.data);
      const initialStatuses = response.data.reduce((acc, order) => {
        acc[order._id] = order.status;
        return acc;
      }, {});
      setOrderStatuses(initialStatuses);
      setOrdersError(null);
    } catch (err) {
      console.error("Error fetching owner's orders:", err);
      setOrdersError("Could not fetch your orders.");
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOwnerProducts();
    fetchOwnerOrders();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get(`${API_URL}/owners/logout`, { withCredentials: true });
      navigate('/owner/login');
    } catch (error) {
      console.error("Logout failed", error);
      alert("Could not log out.");
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!name || !price || !category || !image) {
      alert("Please fill in Name, Price, Category and select an image.");
      return;
    }
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('image', image);
    
    if (brand) formData.append('brand', brand);
    if (style) formData.append('style', style);
    if (tags) {
        tags.split(',').forEach(tag => {
            formData.append('tags[]', tag.trim());
        });
    }

    try {
      await axios.post(`${API_URL}/products/create`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Product created successfully!');
      if (onProductCreated) {
        onProductCreated();
      }
      fetchOwnerProducts(); 
      
      setName('');
      setPrice('');
      setCategory('');
      setBrand('');
      setStyle('');
      setTags('');
      setImage(null);
      e.target.reset();
    } catch (error) {
      console.error("Error creating product:", error);
      alert('Failed to create product. Check if the backend is ready for the new fields.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      try {
        await axios.delete(`${API_URL}/products/${productId}`, { withCredentials: true });
        alert("Product deleted successfully!");
        fetchOwnerProducts();
        if (onProductCreated) {
          onProductCreated();
        }
      } catch (err) {
        console.error("Error deleting product:", err);
        alert("Failed to delete product. Please try again.");
      }
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrderStatuses(prev => ({ ...prev, [orderId]: newStatus }));
  };

  const handleUpdateStatus = async (orderId) => {
    const newStatus = orderStatuses[orderId];
    try {
      await axios.put(`${API_URL}/owners/orders/${orderId}/status`, 
        { status: newStatus }, 
        { withCredentials: true }
      );
      alert('Order status updated successfully!');
      setOwnerOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Error updating order status:", err);
      alert('Failed to update status.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Shipped': return '#007bff';
      case 'Delivered': return '#28a745';
      case 'Cancelled': return '#dc3545';
      case 'Pending':
      default: return '#ffc107';
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Owner Dashboard</h1>
        <button onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>
      <p>Welcome! Add new products or manage your existing ones and orders.</p>
      
      <hr style={{ margin: '2rem 0' }} />
      <div>
        <h2>Create a New Product</h2>
        <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
            <div><label htmlFor="name">Product Name:</label><input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} /></div>
            <div><label htmlFor="price">Price:</label><input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} /></div>
            <div>
                <label htmlFor="category">Category (men/women):</label>
                <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}>
                    <option value="">Select Category</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                </select>
            </div>
            <div><label htmlFor="brand">Brand (e.g., nike, adidas):</label><input id="brand" type="text" value={brand} onChange={(e) => setBrand(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} /></div>
            <div><label htmlFor="style">Style (e.g., sneakers, boots):</label><input id="style" type="text" value={style} onChange={(e) => setStyle(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} /></div>
            <div><label htmlFor="tags">Tags (comma-separated, e.g., new-arrivals, sale):</label><input id="tags" type="text" value={tags} onChange={(e) => setTags(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} /></div>
            <div><label htmlFor="image">Product Image:</label><input id="image" type="file" name="image" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} /></div>
            <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Create Product</button>
        </form>
      </div>

      <hr style={{ margin: '2rem 0' }} />
      <div>
        <h2>Your Products</h2>
        {loadingProducts && <p>Loading your products...</p>}{error && <p style={{ color: 'red' }}>{error}</p>}
        {!loadingProducts && !error && (
          ownerProducts.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {ownerProducts.map(product => (
                <div key={product._id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <img src={`${API_URL}/images/uploads/${product.image}`} alt={product.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '5px' }} />
                    <h4 style={{ margin: '10px 0 5px' }}>{product.name}</h4>
                    <p style={{ fontStyle: 'italic', color: '#666', margin: '0 0 5px' }}>{product.category}</p>
                    <p style={{ margin: '0 0 10px', color: '#333' }}>${product.price.toFixed(2)}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                    <Link to={`/admin/edit-product/${product._id}`} style={{ flex: 1, padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', textDecoration: 'none', fontSize: '14px' }}>Edit</Link>
                    <button onClick={() => handleDeleteProduct(product._id)} style={{ flex: 1, padding: '5px 10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '14px' }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          ) : ( <p>You haven't created any products yet. Use the form above to add your first one!</p> )
        )}
      </div>

      <hr style={{ margin: '2rem 0' }} />
      <div>
        <h2>Your Orders</h2>
        {loadingOrders && <p>Loading your orders...</p>}
        {ordersError && <p style={{ color: 'red' }}>{ordersError}</p>}
        {!loadingOrders && !ordersError && (
          ownerOrders.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {ownerOrders.map(order => (
                <div key={order._id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem', backgroundColor: '#f9f9f9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ margin: 0 }}>Order ID: {order._id}</h4>
                      <p style={{ fontSize: '0.9em', color: '#555' }}>Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span style={{ padding: '5px 10px', borderRadius: '15px', color: 'white', backgroundColor: getStatusColor(order.status), fontWeight: 'bold' }}>{order.status}</span>
                  </div>
                  <div style={{ marginTop: '1rem' }}>
                    <p><strong>Customer:</strong> {order.user.fullName} ({order.user.email})</p>
                    <p><strong>Shipping Address:</strong> {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
                  </div>
                  <div style={{ marginTop: '1rem' }}>
                    <strong>Items in this Order:</strong>
                    <ul style={{ listStyle: 'none', paddingLeft: '0', marginTop: '0.5rem' }}>
                      {order.items.map(item => (
                        <li key={item._id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '8px 0' }}>
                          <span>{item.name}</span>
                          <span style={{ fontWeight: 'bold' }}>${item.price.toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div style={{ textAlign: 'right', marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <select value={orderStatuses[order._id] || order.status} onChange={(e) => handleStatusChange(order._id, e.target.value)} style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}>
                        <option value="Pending">Pending</option><option value="Shipped">Shipped</option><option value="Delivered">Delivered</option><option value="Cancelled">Cancelled</option>
                      </select>
                      <button onClick={() => handleUpdateStatus(order._id)} style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Update Status</button>
                    </div>
                    <h4 style={{ margin: 0, color: '#28a745' }}>Your Total: ${order.ownerTotal.toFixed(2)}</h4>
                  </div>
                </div>
              ))}
            </div>
          ) : ( <p>You have no orders yet.</p> )
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;