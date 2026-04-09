import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaStar, FaShoppingCart, FaHeart } from "react-icons/fa";
import { useCart } from "../context/CartContext";

const Wishlist = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [addedProductId, setAddedProductId] = useState(null);

  const token = localStorage.getItem("token");

  const fetchWishlist = async () => {
    try {
      const res = await axios.get(
        "https://jelidressshop-1.onrender.com/api/wishlist",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWishlistProducts(res.data);

    } catch (err) {
      console.error("Failed to fetch wishlist", err);
    }
  };

  useEffect(() => {
    if (token) fetchWishlist();
  }, [token]);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAddedProductId(product._id);
    setTimeout(() => setAddedProductId(null), 2000);
  };

  const handleRemoveFromWishlist = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await axios.delete(
        `https://jelidressshop-1.onrender.com/api/wishlist/remove/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 🔥 Re-fetch instead of manual filter
      fetchWishlist();

    } catch (err) {
      console.error("Failed to remove from wishlist", err);
    }
  };

  return (
    <section className="section-p1" id="product1">
      <h2>My Wishlist</h2>
      <p>Products you have liked</p>

      <div className="pro-container">
        {wishlistProducts.length === 0 && (
          <p>Your wishlist is empty!</p>
        )}

        {wishlistProducts.map(product => (
          <div
            key={product._id}
            className="pro"
            onClick={() => navigate(`/product/${product._id}`)}
          >
            <img src={product.image} alt={product.name} />

            <div className="des">
              <span>{product.brand}</span>
              <h5>{product.name}</h5>

              <div className="star">
                {[...Array(product.rating || 0)].map((_, i) => (
                  <FaStar key={i} className="checked" />
                ))}
              </div>

              <h4>₹{product.price?.toFixed(2)}</h4>

              {product.discount > 0 && (
                <span className="discount-badge">
                  -{product.discount}% OFF
                </span>
              )}
            </div>

            <button
              onClick={(e) => handleAddToCart(e, product)}
              className={`cart-btn ${
                addedProductId === product._id ? "added" : ""
              }`}
            >
              <FaShoppingCart />
              {addedProductId === product._id && (
                <span className="added-text">✓ Added</span>
              )}
            </button>

            <button
              className="wishlist-btn"
              onClick={(e) =>
                handleRemoveFromWishlist(e, product._id)
              }
            >
              <FaHeart style={{ color: "red" }} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Wishlist;
