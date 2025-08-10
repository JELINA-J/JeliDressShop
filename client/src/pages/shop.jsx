import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaHeart, FaLongArrowAltRight } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [showProduct1, setShowProduct1] = useState(true);
  const [showProduct2, setShowProduct2] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [addedProductId, setAddedProductId] = useState(null);
const wishlistIds = Array.isArray(wishlist) ? wishlist.map(item => item._id) : [];

  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    fetch('http://localhost:5000/api/products/category/shop')

      .then(res => res.json())
      .then(data => {
        setProducts(data);
      })
      .catch(err => console.error(err));
  }, []);
  const userId = localStorage.getItem('userId'); // must store after login

 
const toggleWishlist = (e, productId) => {
  e.preventDefault();
  e.stopPropagation();

  if (wishlist.includes(productId)) {
    setWishlist(prev => prev.filter(id => id !== productId));
  } else {
    setWishlist(prev => [...prev, productId]);
  }
};

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      ...product,
      originalPrice: product.price * 1.2,
      discount: product.discount || 0,
      size: "M",
      seller: product.brand,
      deliveryDate: "Mon Jun 16",
      deliveryCost: 0,
      quantity: 1
    });
    setAddedProductId(product._id); // or product.id
    setTimeout(() => setAddedProductId(null), 2000);
  };

  const handlePage1Click = (e) => {
    e.preventDefault();
    setShowProduct1(true);
    setShowProduct2(false);
    document.getElementById('product1')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePage2Click = (e) => {
    e.preventDefault();
    setShowProduct1(false);
    setShowProduct2(true);
    document.getElementById('product2')?.scrollIntoView({ behavior: 'smooth' });
  };

  // derive page data
 const products1 = products.filter(p => p.sections.includes('shoppage')).slice(0, 16);
const products2 = products.filter(p => p.sections.includes('shoppage')).slice(16, 32);


  const renderProductSection = (products, sectionId) => (
    <section id={sectionId} className="section-p1">
      <div className="pro-container">
        {products.map(product => (
          <div
            key={product._id || product.id}
            className="pro"
            onClick={() => {
              sessionStorage.setItem('sourcePage', 'shop');
               navigate(`/product/${product._id}`)
            }}
          >
<img src={product.images[0]} alt={product.name} />
            <div className="des">
              <span>{product.brand}</span>
              <h5>{product.name}</h5>
              <div className="star">
                {[...Array(product.rating)].map((_, i) => (
                  <FaStar key={i} className="checked" />
                ))}
              </div>
              <h4>₹{product.price.toFixed(2)}</h4>
              {Number(product.discount) > 0 && (
                <span className="discount-badge">-{product.discount}% OFF</span>
              )}

            </div>
            <button
              onClick={(e) => handleAddToCart(e, product)}
              className={`cart-btn ${addedProductId === (product._id || product.id) ? 'added' : ''}`}
            >
              <FaShoppingCart />
              {addedProductId === (product._id || product.id) && <span className="added-text">✓ Added</span>}
            </button>
            <button
              className="wishlist-btn"
onClick={(e) => toggleWishlist(e, product._id || product.id)}
            >
              <FaHeart style={{ color: wishlistIds.includes(product._id)
? 'red' : '' }} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="shop-page">
      <section id="page-header">
        <h2>#stayhome</h2>
        <p>Save more with coupons & up to 70% off!</p>
      </section>
      {showProduct1 && renderProductSection(products1, "product1")}
      {showProduct2 && renderProductSection(products2, "product2")}
      <section id="pagination" className="section-p1">
        <Link to="#" id="page1" onClick={handlePage1Click}>1</Link>
        <Link to="#" id="page2" onClick={handlePage2Click}>2</Link>
        <Link to="#"><FaLongArrowAltRight /></Link>
      </section>
    </div>
  );
};

export default Shop;
