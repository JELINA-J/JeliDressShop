import { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
//import products, { featuredProducts } from '../data/productview';


const CartPage = () => {
    const {
        cartItems,
        removeFromCart,
        updateQuantity,
        clearCart,
        formatINR
    } = useCart();
    const navigate = useNavigate(); // ✅ <-- Add this here


    const calculateTotals = () => {
        const subtotal = cartItems.reduce((sum, item) =>
            sum + (item.price * item.quantity * (1 - (item.discount || 0) / 100)), 0);

        const totalDiscount = cartItems.reduce((sum, item) =>
            sum + (item.price * item.quantity * (item.discount || 0) / 100), 0);
        const deliverycost = 40;

        const total = subtotal + deliverycost;

        return {
            subtotal: formatINR(subtotal + totalDiscount),
            discount: formatINR(totalDiscount),
            delivery: formatINR(deliverycost),
            total: formatINR(total),
            itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
        };
    };

    const { subtotal, discount, delivery, total, itemCount } = calculateTotals();

    const handleClearCart = () => {
        if (window.confirm('Are you sure you want to clear your cart?')) {
            clearCart();
        }
    };

    return (
        <div className="cart-page">
            <div className="cart-header">
                <h2 >Your Shopping Cart</h2>
                <p>{itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart</p>
            </div>

            {cartItems.length === 0 ? (
                <div className="empty-cart">
                    <h4>Your cart is empty</h4>
                    <p>Continue browsing to add items to your cart</p>
                    <Link to="/shop" className="btn btn-continue">
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <div className="cart-container">
                    <div className="cart-items">
                        {cartItems.map(item => (
                            <div key={`${item.id}-${item.size || ''}`} className="cart-item">
                                <Link to={`/product/${item.id}`}>
                                    <img
                                        src={item.image || '/images/placeholder.jpg'}
                                        alt={item.name}
                                        onError={(e) => e.target.src = '/images/placeholder.jpg'}
                                    />
                                </Link>

                                <div className="item-details">
                                    <h3>{item.name}</h3>
                                    {item.size && <p className="item-size">Size: {item.size}</p>}
                                    <p className="item-price">
                                        {/* Discounted price */}
                                        <span className="original-price">
                                            {formatINR(item.price)}
                                        </span>
                                        {item.discount > 0 && (
                                            <span className="discount-badge">
                                                -{item.discount}%
                                            </span>
                                        )}
                                    </p>

                                    <div className="quantity-controls">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                                        >
                                            −
                                        </button>
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            min="1"
                                            onChange={(e) =>
                                                updateQuantity(item.id, item.size, e.target.value)
                                            }
                                        />
                                        <button
                                            onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                        <button
                                            className="remove-btn"
                                            onClick={() => removeFromCart(item.id, item.size)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>

                                <div className="item-total">
                                    {formatINR(
                                        item.price * item.quantity * (1 - (item.discount || 0) / 100)
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h3 className="summary-title">Order Summary</h3>
                        <div className="summary-row">
                            <span>Subtotal ({itemCount} items):</span>
                            <span>{subtotal}</span>
                        </div>
                        <div className="summary-row">
                            <span>Discount:</span>
                            <span>-{discount}</span>
                        </div>
                        <div className="summary-row">
                            <span>Delivery:</span>
                            <span>{delivery}</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total Amount:</span>
                            <span>{total}</span>
                        </div>

                        <div className="cart-actions">
                            <Link to="/shop" className="btn btn-continue">
                                Continue Shopping
                            </Link>
                            <button onClick={handleClearCart} className="btn btn-clear">
                                Clear Cart
                            </button>
                            <Link to="/checkout" className="btn btn-checkout">
                                Proceed to Checkout
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;