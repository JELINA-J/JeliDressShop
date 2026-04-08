import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHeart, FaShoppingBag, FaTimes, FaOutdent, FaComments } from 'react-icons/fa';

const Header = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Check login status whenever page changes
  useEffect(() => {
const token = sessionStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  const isActive = (path) => {
    const current = location.pathname;

    if (path === '/shop' && (current.startsWith('/product') || current === '/shop')) {
      return 'active';
    }

    return current === path ? 'active' : '';
  };

  // ✅ Logout Function
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("username");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <section id="header">
      <Link to="/">
        <img height="90px" src="/images/logo.png" width="90px" alt="Jeli Dress Shop Logo" />
      </Link>

      <div>
        <ul id="navbar" className={isMobileNavOpen ? 'active' : ''}>

          {/* ✅ If NOT logged in → show only Login */}
          {!isLoggedIn && (
            <li>
              <Link to="/" className={isActive('/')}>Login</Link>
            </li>
          )}

          {/* ✅ If logged in → show full menu */}
          {isLoggedIn && (
            <>
              <li>
                <Link to="/home" className={isActive('/home')}>Home</Link>
              </li>

              <li>
                <Link to="/shop" className={isActive('/shop')}>Shop</Link>
              </li>

              <li>
                <Link to="/wishlist" className={isActive('/wishlist')}>
                  <FaHeart />
                </Link>
              </li>

              <li>
                <Link to="/cart" className={isActive('/cart')}>
                  <FaShoppingBag />
                </Link>
              </li>

              <li>
                <Link to="/chatbot" className={isActive('/chatbot')}>
                  <FaComments size={20} />
                </Link>
              </li>

              <li>
                <button 
                  onClick={handleLogout}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
                >
                  Logout
                </button>
              </li>
            </>
          )}

          <Link to="#" id="close" onClick={() => setIsMobileNavOpen(false)}>
            <FaTimes />
          </Link>
        </ul>
      </div>

      <div id="mobile">
        {isLoggedIn && (
          <Link to="/cart">
            <FaShoppingBag />
          </Link>
        )}
        <FaOutdent id="bar" onClick={() => setIsMobileNavOpen(true)} />
      </div>
    </section>
  );
};

export default Header;