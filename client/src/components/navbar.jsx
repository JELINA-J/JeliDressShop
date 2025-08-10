import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHeart, FaShoppingBag, FaTimes, FaOutdent,FaComments } from 'react-icons/fa';

const Header = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const location = useLocation(); // 👈 get the current path

  const isActive = (path) => {
    const current = location.pathname;

    // Show 'Shop' as active for both /shop and /product/:id
    if (path === '/shop' && (current.startsWith('/product') || current === '/shop')) {
      return 'active';
    }

    return current === path ? 'active' : '';
  };

  return (
    <section id="header">
      <Link to="/">
        <img height="90px" src="/images/logo.png" width="90px" alt="Jeli Dress Shop Logo" />
      </Link>

      <div>
        <ul id="navbar" className={isMobileNavOpen ? 'active' : ''}>
          <li>
            <Link to="/" className={isActive('/')}>Login</Link>
          </li>
          <li>
            <Link to="/home" className={isActive('/home')}>Home</Link>
          </li>
          <li>
            <Link to="/shop" className={isActive('/shop')}>Shop</Link>
          </li>

          <li id="wishlist-icon">
            <Link to="/wishlist" className={isActive('/wishlist')}>
              <FaHeart />
            </Link>
          </li>
          <li id="lgbag">
            <Link to="/cart" className={isActive('/cart')}>
              <FaShoppingBag />
            </Link>
          </li>
          <li> 
          <Link to="/chatbot" title="Chat with us" className={isActive('/chatbot')}>
            <FaComments size={20} /> {/* from react-icons/fa */}
            </Link>
          </li>

          <Link to="#" id="close" onClick={() => setIsMobileNavOpen(false)}>
            <FaTimes />
          </Link>
        </ul>
      </div>

      <div id="mobile">
        <Link to="/cart">
          <FaShoppingBag />
        </Link>
        <FaOutdent id="bar" onClick={() => setIsMobileNavOpen(true)} />
      </div>
    </section>
  );
};

export default Header;
