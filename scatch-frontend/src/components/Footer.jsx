import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; {new Date().getFullYear()} Scatch. All rights reserved.</p>
        <p>The Premium Shoe Marketplace</p>
      </div>
    </footer>
  );
};

export default Footer;