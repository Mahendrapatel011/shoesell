// /scatch-frontend/src/pages/CartPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // 1. Import useNavigate
import { axiosInstance, AuthContext } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate(); // 2. Initialize navigate

  // 3. State for the shipping address form
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');

  useEffect(() => {
    if (user) {
      const fetchCartItems = async () => {
        try {
          setLoading(true);
          const response = await axiosInstance.get('/users/cart');
          setCartItems(response.data);
        } catch (err) {
          setError('Failed to fetch cart items.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchCartItems();
    } else {
      setLoading(false);
      setCartItems([]);
    }
  }, [user]);

  // 4. Calculate total price
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  // 5. Handle the order creation
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!street || !city || !postalCode || !country) {
      alert("Please fill out all shipping address fields.");
      return;
    }
    const shippingAddress = { street, city, postalCode, country };
    try {
      const response = await axiosInstance.post('/users/order/create', { shippingAddress });
      alert("Order placed successfully!");
      // Redirect to a success page, passing the new order ID
      navigate(`/order/success/${response.data.orderId}`);
    } catch (err) {
      console.error("Failed to place order:", err);
      alert("There was an error placing your order. Please try again.");
    }
  };

  if (loading) return <p style={{ textAlign: 'center' }}>Loading your cart...</p>;
  if (error) return <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>;

  return (
    <div className="cart-page-container">
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Your Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div style={{ textAlign: 'center' }}>
          <p>Your cart is empty.</p>
          <Link to="/">Go Shopping</Link>
        </div>
      ) : (
        <>
          <div className="product-grid">
            {cartItems.map(item => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>

          <hr style={{ margin: '2rem 0' }} />

          {/* --- 6. The Checkout Section --- */}
          <div className="checkout-section" style={{ maxWidth: '600px', margin: 'auto', padding: '1rem' }}>
            <h2>Order Summary</h2>
            <h3>Total: ${totalPrice.toFixed(2)}</h3>

            <h3 style={{ marginTop: '2rem' }}>Shipping Address</h3>
            <form onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="text" placeholder="Street Address" value={street} onChange={e => setStreet(e.target.value)} required style={{ padding: '8px' }} />
              <input type="text" placeholder="City" value={city} onChange={e => setCity(e.target.value)} required style={{ padding: '8px' }} />
              <input type="text" placeholder="Postal Code" value={postalCode} onChange={e => setPostalCode(e.target.value)} required style={{ padding: '8px' }} />
              <input type="text" placeholder="Country" value={country} onChange={e => setCountry(e.target.value)} required style={{ padding: '8px' }} />
              <button type="submit" style={{ padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1rem' }}>
                Place Order
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;