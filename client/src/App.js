import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import Home from './pages/home';
import Shop from './pages/shop';
import Cart from './pages/cart';
import Wishlist from './pages/wishlist';
import Login from './pages/login';
import Footer from './components/footer';
import Newsletter from './components/newsletter';
import Scroll from './scroll'; // ✅ import it
import ProductView from './pages/productview';
import { CartProvider } from './context/CartContext';
import ChatBot from './pages/chatbot';
import CheckoutPage from './pages/checkout';


function App() {
  return (
    <CartProvider>
      <Router>
        <Scroll />
        <Navbar />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/" element={<Login />} />
          <Route path="/product/:productId" element={<ProductView />} />
          <Route path="/chatbot" element={<ChatBot />} />
          <Route path="/checkout" element={<CheckoutPage />} />


        </Routes>
        <Newsletter />
        <Footer />

      </Router>
    </CartProvider>
  );
}


export default App;
