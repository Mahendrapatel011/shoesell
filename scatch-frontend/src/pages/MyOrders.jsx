// /src/pages/MyOrders.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = "http://localhost:3001";

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${API_URL}/users/orders`, {
                    withCredentials: true,
                });
                setOrders(response.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching orders:", err);
                setError("Could not fetch your orders. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Shipped': return '#007bff';
            case 'Delivered': return '#28a745';
            case 'Cancelled': return '#dc3545';
            case 'Pending':
            default: return '#ffc107';
        }
    };

    if (loading) {
        return <div style={{ padding: '2rem' }}><h2>Loading your orders...</h2></div>;
    }

    if (error) {
        return <div style={{ padding: '2rem', color: 'red' }}><h2>{error}</h2></div>;
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <h1>My Orders</h1>
            {orders.length === 0 ? (
                <p>You have not placed any orders yet. <Link to="/">Start shopping!</Link></p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {orders.map(order => (
                        <div key={order._id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem', backgroundColor: '#f9f9f9' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #eee', paddingBottom: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <h3 style={{ margin: 0 }}>Order ID: {order._id}</h3>
                                    <p style={{ fontSize: '0.9em', color: '#555', margin: '5px 0 0' }}>
                                        Placed on: {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <span style={{ padding: '5px 15px', borderRadius: '15px', color: 'white', backgroundColor: getStatusColor(order.status), fontWeight: 'bold', fontSize: '0.9em' }}>
                                    {order.status}
                                </span>
                            </div>
                            
                            <div style={{ marginTop: '1rem' }}>
                                <strong>Items Purchased:</strong>
                                <ul style={{ listStyle: 'none', paddingLeft: '0', marginTop: '0.5rem' }}>
                                    {order.items.map(item => (
                                        <li key={item._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                                            <span>{item.name}</span>
                                            <span style={{ color: '#555' }}>${item.price.toFixed(2)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div style={{ textAlign: 'right', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
                                <h4 style={{ margin: 0, color: '#333' }}>Total Amount: ${order.totalAmount.toFixed(2)}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;