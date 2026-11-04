import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CheckoutPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const { cartItems, clearCart, formatINR } = useCart();
  const navigate = useNavigate();

  // Calculate order totals
  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => 
      sum + (item.price * item.quantity * (1 - (item.discount || 0) / 100)), 0);
    const totalDiscount = cartItems.reduce((sum, item) => 
      sum + (item.price * item.quantity * (item.discount || 0) / 100), 0);
    const shipping =  40;
    const total = subtotal + shipping;
    
    return {
      subtotal: formatINR(subtotal + totalDiscount),
      discount: formatINR(totalDiscount),
      shipping: formatINR(shipping),
      total: formatINR(total),
      itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
    };
  };

  const { subtotal, discount, shipping, total, itemCount } = calculateTotals();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setCurrentStep(2);
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setCurrentStep(3);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setCurrentStep(4);
    // In a real app, you would process payment here
    setTimeout(() => {
      setOrderConfirmed(true);
      clearCart();
    }, 2000);
  };

  const renderStep = () => {
    switch(currentStep) {
      case 1: // Login
        return (
          <div className="checkout-step">
            <h3>Login to Continue</h3>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email</label>
                <input type="email" required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" required />
              </div>
              <button type="submit" className="btn-continue">Login & Continue</button>
              <p>Don't have an account? <button 
                type="button" 
                className="btn-link"
                onClick={() => navigate('/register')}
              >
                Register here
              </button></p>
            </form>
          </div>
        );

      case 2: // Delivery Address
        return (
          <div className="checkout-step">
            <h3>Delivery Address</h3>
            <form onSubmit={handleAddressSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={deliveryAddress.name}
                  onChange={(e) => setDeliveryAddress({...deliveryAddress, name: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Street Address</label>
                <input 
                  type="text" 
                  value={deliveryAddress.street}
                  onChange={(e) => setDeliveryAddress({...deliveryAddress, street: e.target.value})}
                  required 
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input 
                    type="text" 
                    value={deliveryAddress.city}
                    onChange={(e) => setDeliveryAddress({...deliveryAddress, city: e.target.value})}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input 
                    type="text" 
                    value={deliveryAddress.state}
                    onChange={(e) => setDeliveryAddress({...deliveryAddress, state: e.target.value})}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>ZIP Code</label>
                  <input 
                    type="text" 
                    value={deliveryAddress.zip}
                    onChange={(e) => setDeliveryAddress({...deliveryAddress, zip: e.target.value})}
                    required 
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  value={deliveryAddress.phone}
                  onChange={(e) => setDeliveryAddress({...deliveryAddress, phone: e.target.value})}
                  required 
                />
              </div>
              <button type="submit" className="btn-continue">Continue to Payment</button>
            </form>
          </div>
        );

      case 3: // Order Summary & Payment
        return (
          <div className="checkout-step">
            <h3>Payment Method</h3>
            <form onSubmit={handlePaymentSubmit}>
              <div className="payment-methods">
                <label className="payment-option">
                  <input 
                    type="radio" 
                    name="payment" 
                    value="credit_card" 
                    checked={paymentMethod === 'credit_card'}
                    onChange={() => setPaymentMethod('credit_card')}
                  />
                  Credit/Debit Card
                </label>
                <label className="payment-option">
                  <input 
                    type="radio" 
                    name="payment" 
                    value="upi" 
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                  />
                  UPI Payment
                </label>
                <label className="payment-option">
                  <input 
                    type="radio" 
                    name="payment" 
                    value="cod" 
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  Cash on Delivery
                </label>
              </div>

              <div className="cart-summary">
                <h3 className="summary-title">Order Summary</h3>
              <div className="summary-row">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>{subtotal}</span>
                </div>
                <div className="summary-row">
                  <span>Discount</span>
                  <span>-{discount}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery</span>
                  <span>{shipping}</span>
                </div>
                <div className="summary-row total">
                  <span>Total Amount</span>
                  <span>{total}</span>
                </div>
              </div>

              <button type="submit" className="btn-confirm">Confirm Order</button>
            </form>
          </div>
        );

      case 4: // Confirmation
        return (
          <div className="checkout-step confirmation">
            {orderConfirmed ? (
              <>
                <div className="confirmation-icon">✓</div>
                <h2>Order Confirmed!</h2>
                <p>Your order has been placed successfully.</p>
                <p>A confirmation email has been sent to your registered email address.</p>
                <button 
                  onClick={() => navigate('/')} 
                  className="btn-continue"
                >
                  Continue Shopping
                </button>
              </>
            ) : (
              <div className="processing-payment">
                <div className="spinner"></div>
                <p>Processing your payment...</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <h2>Checkout</h2>
        <div className="progress-steps">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
            <span>1</span>
            <p>Login</p>
          </div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
            <span>2</span>
            <p>Address</p>
          </div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            <span>3</span>
            <p>Payment</p>
          </div>
          <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>
            <span>4</span>
            <p>Confirmation</p>
          </div>
        </div>
      </div>

      <div className="checkout-content">
        {renderStep()}
      </div>
    </div>
  );
};

export default CheckoutPage;