import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext, axiosInstance } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Navbar.css';

// --- Data for Shoe-specific Mega Menu ---
const shoeMegaMenuData = {
  styles: [
    { name: 'Sneakers', value: 'sneakers' },
    { name: 'Running Shoes', value: 'running' },
    { name: 'Boots', value: 'boots' },
    { name: 'Formal Shoes', value: 'formal' },
    { name: 'Sandals & Floaters', value: 'sandals' },
    { name: 'Loafers', value: 'loafers' },
  ],
  topBrands: [
    { name: 'Nike', value: 'nike', img: 'https://via.placeholder.com/150/f9a8d4/2a1b3d?text=Nike' },
    { name: 'Adidas', value: 'adidas', img: 'https://via.placeholder.com/150/fce4ec/2a1b3d?text=Adidas' },
    { name: 'Puma', value: 'puma', img: 'https://via.placeholder.com/150/e1bee7/2a1b3d?text=Puma' },
    { name: 'Reebok', value: 'reebok', img: 'https://via.placeholder.com/150/d1c4e9/2a1b3d?text=Reebok' },
  ],
};


const Navbar = ({ onSearch, searchQuery, handleFilterChange }) => { 
  const { user, logout } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState(searchQuery || '');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  
  useEffect(() => {
    setSearchTerm(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const fetchCartCount = async () => {
      if (user) {
        try {
          const response = await axiosInstance.get('/users/cart');
          setCartItemCount(response.data.items.length || 0);
        } catch (error) {
           console.error("Failed to fetch cart data for count", error);
           setCartItemCount(0);
        }
      } else {
        setCartItemCount(0);
      }
    };

    fetchCartCount();
    const handleCartUpdate = () => fetchCartCount();
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [user]);

  const handleLogout = () => {
    logout();
    toast.info("You have been logged out.");
    closeMenu();
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
    closeMenu();
  };
  
  const handleLogoClick = () => {
    if (handleFilterChange) {
      handleFilterChange('clear', '');
    }
    setSearchTerm('');
    closeMenu();
  };

  const handleLinkClick = (filterType, value) => {
      if (handleFilterChange) {
        handleFilterChange(filterType, value);
      }
      closeMenu();
  }

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsMegaMenuOpen(false);
  }
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-container">
          <div className="top-bar-left">
            <i className="fa-solid fa-phone"></i>
            <span>8951940695</span>
          </div>
          
          {/* LEADERBOARD LINK REMOVED FROM HERE */}
          <div className="top-bar-center"></div>

          <div className="top-bar-right">
            <form onSubmit={handleSearchSubmit} className="top-search-form">
              <input
                type="text"
                placeholder="Search for sneakers, boots..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="top-search-input"
              />
              <button type="submit" aria-label="Search">
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </form>
            <Link to="/cart" className="top-bar-icon" aria-label="Cart">
              <i className="fa-solid fa-cart-shopping"></i>
              {user && cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount}</span>
              )}
            </Link>
            {user ? (
               <Link to="/profile" className="top-bar-icon" aria-label="Profile">
                 <i className="fa-solid fa-user"></i>
               </Link>
            ) : (
              <Link to="/login" className="top-bar-icon" aria-label="Login">
                 <i className="fa-solid fa-user"></i>
              </Link>
            )}
             <div className="menu-icon" onClick={toggleMenu} aria-label="Toggle menu">
                <i className={isMenuOpen ? 'fas fa-times' : 'fas fa-bars'} />
            </div>
          </div>
        </div>
      </div>

      <header className={`main-header ${isMegaMenuOpen ? 'mega-menu-active' : ''}`}>
        <div className="main-header-container">
          <Link to="/" className="navbar-logo" onClick={handleLogoClick}>
            Scatch
          </Link>
          
          <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <div className="mobile-only-header">
                {user ? (
                    <>
                     <Link to="/profile" className="nav-item" onClick={closeMenu}>Hi, {user.fullName.split(' ')[0]}</Link>
                     <button onClick={handleLogout} className="nav-item nav-button">Logout</button>
                    </>
                ) : (
                    <>
                     <Link to="/login" className="nav-item" onClick={closeMenu}>Login</Link>
                     <Link to="/register" className="nav-item nav-item-cta" onClick={closeMenu}>Sign Up</Link>
                    </>
                )}
            </div>
            
            <div className="desktop-nav-links">
                <Link to="/" className="nav-item" onClick={() => handleLinkClick('tag', 'new-arrivals')}>New Arrivals</Link>
                <div 
                    className="nav-item with-megamenu" 
                    onMouseEnter={() => setIsMegaMenuOpen(true)} 
                    onMouseLeave={() => setIsMegaMenuOpen(false)}
                >
                    <Link to="/" onClick={() => handleLinkClick('category', 'men')}>Men's</Link>
                    <div className="mega-menu">
                        <div className="mega-menu-content">
                            <div className="mega-menu-column">
                                <h3>Shop by Style</h3>
                                <ul>
                                    {shoeMegaMenuData.styles.map(cat => (
                                        <li key={cat.name}>
                                            <Link to="/" onClick={() => handleLinkClick('style', cat.value)}>{cat.name}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mega-menu-column">
                                <h3>Shop by Brand</h3>
                                <div className="mega-menu-image-grid">
                                    {shoeMegaMenuData.topBrands.map(cat => (
                                        <Link to="/" key={cat.name} className="mega-menu-image-item" onClick={() => handleLinkClick('brand', cat.value)}>
                                            <img src={cat.img} alt={cat.name} />
                                            <span>{cat.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Link to="/" className="nav-item" onClick={() => handleLinkClick('category', 'women')}>Women's</Link>
                <Link to="/" className="nav-item" onClick={() => handleLinkClick('style', 'sneakers')}>Sneakers</Link>
                <Link to="/" className="nav-item sale" onClick={() => handleLinkClick('tag', 'sale')}>Sale</Link>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Navbar;