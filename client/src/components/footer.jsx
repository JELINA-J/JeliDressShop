import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaPinterest, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="section-p1">
      <div className="col">
        <img className="logo" height="85px" src="images/logo.png" width="85px" alt="Jeli Dress Shop Logo" />
        <h4>Contact</h4>
        <p>
          <strong>Address:</strong> 562 Willington Road, Street 32, San Francisco
        </p>
        <p>
          <strong>Phone:</strong> 998843322 / (+91) 989567321
        </p>
        <p>
          <strong>Hours:</strong> 10:00-18:00, Mon-Sat
        </p>
        <div className="follow">
          <h4>Follow Us</h4>
          <div className="icon">
            <FaFacebook />
            <FaTwitter />
            <FaInstagram />
            <FaPinterest />
            <FaYoutube />
          </div>
        </div>
      </div>

      <div className="col">
        <h4>About</h4>
        <Link to="/about">About Us</Link>
        <Link to="/delivery">Delivery Information</Link>
        <Link to="/privacy">Privacy Policy</Link>
        <Link to="/terms">Terms &amp; Conditions</Link>
        <Link to="/contact">Contact Us</Link>
      </div>

      <div className="col">
        <h4>Account</h4>
        <Link to="/login">Sign In</Link>
        <Link to="/cart">View Cart</Link>
        <Link to="/wishlist">My Wishlist</Link>
        <Link to="/track-order">Track My Order</Link>
        <Link to="/help">Help</Link>
      </div>

      <div className="col install">
        <h4>Install App</h4>
        <p>From App Store or Google App</p>
        <div className="row">
          <img src="images/app.jpg" alt="App Store" />
          <img src="images/play.jpg" alt="Google Play" />
        </div>
        <p>Secured Payment Gateways</p>
        <img src="images/pay.png" alt="Payment Methods" />
      </div>

      <div className="copy-right">
        <p>©2021, Tech2 etc-HTML CSS Ecommerce Template</p>
      </div>
    </footer>
  );
};

export default Footer;