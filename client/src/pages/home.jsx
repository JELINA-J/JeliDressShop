import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaHeart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import useWishlist from '../hooks/useWishlist';

const Home = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [addedProductId, setAddedProductId] = useState(null);
  const username = localStorage.getItem('username');
 // const { wishlistIds, toggleWishlist } = useWishlist();
  const [ setWishlistIds] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const wishlistIds = Array.isArray(wishlist) ? wishlist.map(item => item._id) : [];

  const features = [
    { id: 1, title: "Free Shipping", image: "images/f1.png" },
    { id: 2, title: "Order", image: "images/f2.png" },
    { id: 3, title: "Money", image: "images/f3.png" },
    { id: 4, title: "Promotion", image: "images/f4.png" },
    { id: 5, title: "Happy Sell", image: "images/f5.png" },
    { id: 6, title: "Support", image: "images/f6.png" }
  ];
  const userId = localStorage.getItem('userId'); // must store after login

  useEffect(() => {
    async function fetchHomepageProducts() {
      try {
        const res = await axios.get('http://localhost:5000/api/products/section/homepage');
        // You can still filter by category if you want to split featured vs new
        setFeaturedProducts(res.data.filter(p => p.category.includes("featured")));
        setNewArrivals(res.data.filter(p => p.category.includes("new")));
      } catch (error) {
        console.error('Error fetching homepage products:', error);
      }
    }
    fetchHomepageProducts();
  }, []);


  // Load wishlist
/*
  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    setWishlist(storedWishlist);
  }, []);

  const toggleWishlist = (e, productId) => {
    e.preventDefault();
    e.stopPropagation();

    let updatedWishlist;
    if (wishlist.includes(productId)) {
      updatedWishlist = wishlist.filter(id => id !== productId);
    } else {
      updatedWishlist = [...wishlist, productId];
    }

    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };
*/
useEffect(() => {
    async function fetchWishlist() {
      try {
        const res = await axios.get('http://localhost:5000/api/wishlist');
        // Map wishlist items to just their productId
        const ids = res.data.map(item => item.productId || item._id);
        setWishlist(ids);
      } catch (err) {
        console.error('Failed to load wishlist', err);
      }
    }
    fetchWishlist();
  }, []);
const toggleWishlist = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (wishlist.includes(productId)) {
        await axios.delete(`http://localhost:5000/api/wishlist/remove/${productId}`);
        setWishlist(prev => prev.filter(id => id !== productId));
      } else {
        await axios.post('http://localhost:5000/api/wishlist/add', { productId });
        setWishlist(prev => [...prev, productId]);
      }
    } catch (err) {
      console.error('Failed to toggle wishlist', err);
    }
  };
/*useEffect(() => {
  async function fetchWishlist() {
    try {
      const res = await axios.get('http://localhost:5000/api/wishlist');
      setWishlist(res.data);
    } catch (err) {
      console.error('Failed to load wishlist', err);
    }
  }
  fetchWishlist();
}, []);*/
useEffect(() => {
  async function fetchWishlist() {
    try {
      const res = await axios.get('http://localhost:5000/api/wishlist');
      const ids = res.data.map(item => item.productId || item._id); // ensure it's an array of IDs
      setWishlist(ids);
    } catch (err) {
      console.error('Failed to load wishlist', err);
    }
  }
  fetchWishlist();
}, []);


/*const toggleWishlist = async (e, productId) => {
  e.preventDefault();
  e.stopPropagation();

  try {
    if (wishlist.includes(productId)) {
      // remove
      const res = await axios.delete(`http://localhost:5000/api/wishlist/remove/${productId}`);
      setWishlist(res.data);
    } else {
      // add
      const res = await axios.post('http://localhost:5000/api/wishlist/add', { productId });
      setWishlist(res.data);
    }
  } catch (err) {
    console.error('Failed to toggle wishlist', err);
  }
};
*/
  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      ...product,
      originalPrice: product.price * 1.2, // Example original price
      discount: product.discount || 0,
      size: "M",
      seller: product.brand,
      deliveryDate: "Mon Jun 16",
      deliveryCost: 0,
      quantity: 1
    });

    setAddedProductId(product._id);
    setTimeout(() => setAddedProductId(null), 2000);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section id="hero">
        <h1>Welcome back, {username}! 🎉</h1>
        <h4>Trade-in offer</h4>
        <h2>Super value deals</h2>
        <h1>On all properties</h1>
        <p>Save more with coupons & up to 70% off!</p>
        <Link to="/shop" className="button">Shop now</Link>
      </section>

      {/* Feature Section */}
      <section className="section-p1" id="feature">
        {features.map(feature => (
          <div className="fe-box" key={feature.id}>
            <img src={feature.image} alt={feature.title} />
            <h6><b>{feature.title}</b></h6>
          </div>
        ))}
      </section>

      {/* Featured Products */}
      <section className="section-p1" id="product1">
        <h2>Featured Products</h2>
        <p>Summer Collection New Modern Design</p>
        <div className="pro-container">
          {featuredProducts.map(product => (
            <div
              key={product._id}
              className="pro"
              onClick={() => {
                sessionStorage.setItem('sourcePage', 'home');
                navigate(`/product/${product._id}`);
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
                className={`cart-btn ${addedProductId === product._id ? 'added' : ''}`}
              >
                <FaShoppingCart />
                {addedProductId === product._id && <span className="added-text">✓ Added</span>}
              </button>
              <button
                className="wishlist-btn"
                onClick={(e) => toggleWishlist(e, product._id)}
              >
<FaHeart style={{ color:wishlist.includes(product._id) ? 'red' : '' }} />
              </button>
            </div>
          ))}
        </div>
      </section >

      {/* Banner Section */}
      < section className="section-m1" id="banner" >
        <h4>Repair Services</h4>
        <h2>Up to <span>70% off</span> - All t-shirts & Accessories</h2>
        <Link to="/shop" className="normal">Explore more</Link>
      </section >

      {/* New Arrivals */}
      < section className="section-p1" id="product1" >
        <h2>New Arrivals</h2>
        <p>Summer Collection New Modern Design</p>
        <div className="pro-container">
          {newArrivals.map(product => (
            <div
              key={product._id}
              className="pro"
              onClick={() => {
                sessionStorage.setItem('sourcePage', 'home');
                navigate(`/product/${product._id}`);
              }}
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
                {Number(product.discount) > 0 && (
                  <span className="discount-badge">-{product.discount}% OFF</span>
                )}
              </div>
              <button
                onClick={(e) => handleAddToCart(e, product)}
                className={`cart-btn ${addedProductId === product._id ? 'added' : ''}`}
              >
                <FaShoppingCart />
                {addedProductId === product._id && <span className="added-text">✓ Added</span>}
              </button>
              <button
                className="wishlist-btn"
                onClick={(e) => toggleWishlist(e, product._id)}
              >
                <FaHeart style={{ color: wishlist.includes(product._id)
 ? 'red' : '' }} />
              </button>
            </div>
          ))}
        </div>
      </section >

      {/* Double Banner */}
      < section className="section-p1" id="sm-banner" >
        <div className="banner-box">
          <h4>crazy deals</h4>
          <h2>buy 1 get 1 free</h2>
          <span>The best classic dress is on sale at jeli</span>
          <Link to="/shop" className="white">Learn More</Link>
        </div>
        <div className="banner-box banner-box2">
          <h4>spring/summer</h4>
          <h2>upcoming season</h2>
          <span>The best classic dress is on sale at jeli</span>
          <Link to="/shop" className="white">Collection</Link>
        </div>
      </section >

      {/* Triple Banner */}
      < section id="banner3" >
        <div className="banner-box">
          <h2>SEASONAL SALE</h2>
          <h3>Winter Collection-50% OFF</h3>
        </div>
        <div className="banner-box banner-box2">
          <h2>NEW FOOTWEAR COLLECTION</h2>
          <h3>Spring/Summer 2024</h3>
        </div>
        <div className="banner-box banner-box3">
          <h2>T-SHIRTS</h2>
          <h3>Trendy New Prints</h3>
        </div>
      </section >
    </div >
  );
};

export default Home;