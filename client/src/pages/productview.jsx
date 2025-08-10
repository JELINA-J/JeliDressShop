// src/pages/ProductView.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaShoppingCart, FaHeart, FaStar } from 'react-icons/fa';
import products, { featuredProducts } from '../data/productsdetail';
import { useCart } from '../context/CartContext';

const ProductView = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('small');
  const [quantity, setQuantity] = useState(1);
  const [addedProductId, setAddedProductId] = useState(null);
  const [wishlist, setWishlist] = useState([]);

  const { addToCart } = useCart();

  useEffect(() => {
  async function fetchProduct() {
    const res = await fetch(`http://localhost:5000/api/products/${productId}`);
    const data = await res.json();
    setProduct(data);
    setMainImage(data.images[0]);
  }
  fetchProduct();


    // Load wishlist from localStorage
    const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    setWishlist(storedWishlist);
  }, [productId, navigate]);

  const toggleWishlist = (e, id) => {
    e.preventDefault();
    e.stopPropagation();

    const updated = wishlist.includes(id)
      ? wishlist.filter(wid => wid !== id)
      : [...wishlist, id];

    setWishlist(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
  };

  const handleAddToCart = (e, prod) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      ...prod,
      size: selectedSize,
      quantity,
      originalPrice: prod.price * 1.2,
      discount: prod.discount || 0,
      seller: prod.brand,
      deliveryDate: "Mon Jun 16",
      deliveryCost: 0
    });

    setAddedProductId(prod.id);
    setTimeout(() => setAddedProductId(null), 2000);
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="shop-page">
      <section id="prodetails" className="section-p1">
        <div className="single-pro-img">
          <button className="back-arrow" onClick={() => navigate(-1)}>
            <FaChevronLeft />
          </button>
          <div className="single">
            <img
              id="main-img"
              src={`${mainImage}?${Date.now()}`}
              alt={product.name}
              onError={(e) => { e.target.src = '/placeholder.jpg'; }}
            />
            {Array.isArray(product.images) && product.images.length > 1 && (
  <div className="small-img-group">
    {product.images.map((img, index) => (
      <div className="small-img-col" key={index}>
        <img
          src={img}
          className={`small-img ${mainImage === img ? 'active' : ''}`}
          alt={`Thumbnail ${index + 1}`}
          onClick={() => setMainImage(img)}
        />
      </div>
    ))}
  </div>
)}

           
          </div>
        </div>

        <div className="details">
          <h2>{product.name}</h2>
          <h3>{product.brand}</h3>
          <p>{product.description}</p>
          <h4>₹{product.price.toFixed(2)}</h4>

          <label htmlFor="size">Select Size:</label>
          <select id="size" value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
            <option value="small">Small (S)</option>
            <option value="medium">Medium (M)</option>
            <option value="large">Large (L)</option>
            <option value="xl">Extra Large (XL)</option>
            <option value="xxl">Double Extra Large (XXL)</option>
          </select>

          <input
            type="number"
            value={quantity}
            min="1"
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          />

          <button
            className={`add-to-cart ${addedProductId === product.id ? 'added' : ''}`}
            onClick={(e) => handleAddToCart(e, product)}
          >
            Add to Cart
            {addedProductId === product.id && <span className="added-text">✓ Added</span>}
          </button>

          <button className="buy-button" onClick={() => navigate('/checkout')}>
            Buy Now
          </button>

          <button
            className="wishlist-btn"
            onClick={(e) => toggleWishlist(e, product.id)}
          >
            <FaHeart style={{ color: wishlist.includes(product.id) ? 'red' : '' }} />
          </button>
        </div>
      </section>

      <section className="section-p1" id="product1">
        <h2>Feature Products</h2>
        <p>Summer Collection New Modern Design</p>
        <div className="pro-container">
          {featuredProducts.map(fp => (
            <div
              key={fp.id}
              className="pro"
              onClick={() => navigate(`/product/${fp.id}`)}
            >
              <img src={fp.image} alt={fp.name} />
              <div className="des">
                <span>{fp.brand}</span>
                <h5>{fp.name}</h5>
                <div className="star">
                  {[...Array(fp.rating)].map((_, i) => <FaStar key={i} className="checked" />)}
                </div>
<h4>₹{product.price ? Number(product.price).toFixed(2) : '0.00'}</h4>
              </div>
              <button
                onClick={(e) => handleAddToCart(e, fp)}
                className={`cart-btn ${addedProductId === fp.id ? 'added' : ''}`}
              >
                <FaShoppingCart />
                {addedProductId === fp.id && <span className="added-text">✓ Added</span>}
              </button>
              <button
                className="wishlist-btn"
                onClick={(e) => toggleWishlist(e, fp.id)}
              >
                <FaHeart style={{ color: wishlist.includes(fp.id) ? 'red' : '' }} />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductView;
