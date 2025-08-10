import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaHeart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const Wishlist = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);          // dynamic products
  const [wishlistIds, setWishlistIds] = useState([]);
  const [addedProductId, setAddedProductId] = useState(null);

  // Fetch products from backend on load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products'); // adjust your backend URL
        setProducts(res.data);
      } catch (err) {
        console.error('Failed to fetch products', err);
      }
    };
    fetchProducts();

    // Load wishlist from localStorage
    const stored = JSON.parse(localStorage.getItem('wishlist')) || [];
    setWishlistIds(stored);
  }, []);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 2000);
  };

  // Remove from wishlist and DB
  const handleRemoveFromWishlist = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = wishlistIds.filter(id => id !== productId);
    setWishlistIds(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));

    try {
      await axios.delete(`http://localhost:5000/api/wishlist/remove/${productId}`);
    } catch (err) {
      console.error('Failed to remove from wishlist in DB', err);
    }
  };

  // Filter products that are in wishlist
  const wishlistProducts = products.filter(p => wishlistIds.includes(p.id));

  return (
    <section className="section-p1" id="product1">
      <h2>My Wishlist</h2>
      <p>Products you have liked</p>
      <div className="pro-container">
        {wishlistProducts.length === 0 && <p>Your wishlist is empty!</p>}
        {wishlistProducts.map(product => (
          <div
            key={product.id}
            className="pro"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            <img src={product.image} alt={product.name} />
            <div className="des">
              <span>{product.brand}</span>
              <h5>{product.name}</h5>
              <div className="star">
                {[...Array(product.rating)].map((_, i) => (
                  <FaStar key={i} className="checked" />
                ))}
              </div>
              <h4>₹{product.price.toFixed(2)}</h4>
              {product.discount > 0 && (
                <span className="discount-badge">-{product.discount}% OFF</span>
              )}
            </div>
            <button
              onClick={(e) => handleAddToCart(e, product)}
              className={`cart-btn ${addedProductId === product.id ? 'added' : ''}`}
            >
              <FaShoppingCart />
              {addedProductId === product.id && <span className="added-text">✓ Added</span>}
            </button>
            <button
              className="wishlist-btn"
              onClick={(e) => handleRemoveFromWishlist(e, product.id)}
            >
              <FaHeart style={{ color: 'red' }} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Wishlist;
