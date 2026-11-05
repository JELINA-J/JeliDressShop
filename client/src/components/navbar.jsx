
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaHeart,
  FaShoppingBag,
  FaTimes,
  FaOutdent,
  FaComments
} from 'react-icons/fa';

const Header = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Hide header on login/register page
  const isAuthPage = location.pathname === '/';

  // Check login status whenever page changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    setIsMobileNavOpen(false);
  }, [location]);

  const isActive = (path) => {
    const current = location.pathname;

    if (
      path === '/shop' &&
      (current.startsWith('/product') || current === '/shop')
    ) {
      return 'active';
    }

    return current === path ? 'active' : '';
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    setIsLoggedIn(false);
    setIsMobileNavOpen(false);

    navigate("/");
  };

  // Do not display navbar on login/register page
  if (isAuthPage) {
    return null;
  }

  return (
    <section id="header">

      {/* LOGO */}
      <Link to="/">
        <img
          height="90px"
          src="/images/logo.png"
          width="90px"
          alt="Jeli Dress Shop Logo"
        />
      </Link>

      {/* DESKTOP / MOBILE NAVIGATION */}
      <div>
        <ul
          id="navbar"
          className={isMobileNavOpen ? 'active' : ''}
        >

          {/* Show menu only when logged in */}
          {isLoggedIn && (
            <>
              <li>
                <Link
                  to="/home"
                  className={isActive('/home')}
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/shop"
                  className={isActive('/shop')}
                >
                  Shop
                </Link>
              </li>

              <li>
                <Link
                  to="/wishlist"
                  className={isActive('/wishlist')}
                >
                  <FaHeart />
                </Link>
              </li>

              <li>
                <Link
                  to="/cart"
                  className={isActive('/cart')}
                >
                  <FaShoppingBag />
                </Link>
              </li>

              <li>
                <Link
                  to="/chatbot"
                  className={isActive('/chatbot')}
                >
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

          {/* CLOSE MOBILE MENU */}
          <Link
            to="#"
            id="close"
            onClick={(e) => {
              e.preventDefault();
              setIsMobileNavOpen(false);
            }}
          >
            <FaTimes />
          </Link>

        </ul>
      </div>

      {/* MOBILE MENU ICONS */}
      <div id="mobile">

        {isLoggedIn && (
          <Link to="/cart">
            <FaShoppingBag />
          </Link>
        )}

        <FaOutdent
          id="bar"
          onClick={() => setIsMobileNavOpen(true)}
        />

      </div>

    </section>
  );
};

export default Header;
