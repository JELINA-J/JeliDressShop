import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // ✅ LOAD CART
  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoaded(true);
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/cart", {
          headers: { Authorization: `Bearer ${token}` }
        });

        setCartItems(res.data || []);
      } catch (err) {
        console.error("Error fetching cart", err);
      } finally {
        setIsLoaded(true);
      }
    };

    fetchCart();
  }, []);

  // ✅ SAVE CART
  useEffect(() => {
    if (!isLoaded) return;

    const saveCart = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const formattedItems = cartItems.map(item => ({
  productId: item._id.toString(),
  name: item.name,
  price: item.price,
  image: item.image,
  size: item.size,
  discount: item.discount,
  quantity: item.quantity
}));

      try {
        await axios.post(
          "http://localhost:5000/api/cart/save",
          { items: formattedItems },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("Error saving cart", err);
      }
    };

    saveCart();
  }, [cartItems, isLoaded]);

  // ✅ ADD TO CART
  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(
        item => item._id === product._id
      );

      if (existing) {
        return prev.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // ✅ REMOVE
  const removeFromCart = (productId) => {
    setCartItems(prev =>
      prev.filter(item => item._id !== productId)
    );
  };

  // ✅ UPDATE QTY
  const updateQuantity = (productId, newQty) => {
    const quantity = Math.max(1, parseInt(newQty) || 1);

    setCartItems(prev =>
      prev.map(item =>
        item._id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const formatINR = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount || 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        formatINR
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);