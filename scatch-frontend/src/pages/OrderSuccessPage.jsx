// /scatch-frontend/src/pages/OrderSuccessPage.jsx

import React from 'react';
import { Link, useParams } from 'react-router-dom';

const OrderSuccessPage = () => {
    const { orderId } = useParams();

    return (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', border: '1px solid #ddd', maxWidth: '600px', margin: '2rem auto', borderRadius: '8px' }}>
            <h1 style={{ color: '#28a745' }}>✓ Thank You!</h1>
            <h2>Your order has been placed successfully.</h2>
            <p>Your Order ID is: <strong>{orderId}</strong></p>
            <p>We've received your order and will begin processing it shortly.</p>
            <Link 
                to="/"
                style={{
                    display: 'inline-block',
                    marginTop: '1.5rem',
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '5px'
                }}
            >
                Continue Shopping
            </Link>
        </div>
    );
};

export default OrderSuccessPage;