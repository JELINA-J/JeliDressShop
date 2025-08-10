// src/hooks/useWishlist.js
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useWishlist() {
  const userId = localStorage.getItem('userId');
  const [wishlistIds, setWishlistIds] = useState([]);

  useEffect(() => {
    if (!userId) return;
    const fetchWishlist = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/wishlist', {
          params: { userId }
        });
        setWishlistIds(res.data);  // expects array of productIds
      } catch (err) {
        console.error('Failed to fetch wishlist', err);
      }
    };
    fetchWishlist();
  }, [userId]);

  const toggleWishlist = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (wishlistIds.includes(productId)) {
        await axios.delete(`http://localhost:5000/api/wishlist/remove/${productId}`, {
          params: { userId }
        });
        setWishlistIds(prev => prev.filter(id => id !== productId));
      } else {
        await axios.post('http://localhost:5000/api/wishlist/add', { userId, productId });
        setWishlistIds(prev => [...prev, productId]);
      }
    } catch (err) {
      console.error('Error updating wishlist', err);
    }
  };

  return { wishlistIds, toggleWishlist };
}
