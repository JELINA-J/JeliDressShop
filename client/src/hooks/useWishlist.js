import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

export default function useWishlist() {
  const [wishlistIds, setWishlistIds] = useState([]);
  const token = localStorage.getItem("token");
  const location = useLocation();   // 👈 important

  const fetchWishlist = async () => {
    try {
      const res = await axios.get(
        "https://jelidressshop-1-1.onrender.com/api/wishlist",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWishlistIds(res.data.map(product => product._id));
    } catch (err) {
      console.error("Failed to fetch wishlist", err);
    }
  };

  // 🔥 Refetch every time route changes
  useEffect(() => {
    if (!token) return;
    fetchWishlist();
  }, [location.pathname]);   // 👈 THIS FIXES IT

  const toggleWishlist = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (wishlistIds.includes(productId)) {
        await axios.delete(
          `https://jelidressshop-1-1.onrender.com/api/wishlist/remove/${productId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post(
          "https://jelidressshop-1-1.onrender.com/api/wishlist/add",
          { productId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      fetchWishlist();  // keep synced
    } catch (err) {
      console.error("Error updating wishlist", err);
    }
  };

  return { wishlistIds, toggleWishlist };
}
