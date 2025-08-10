/*import express from 'express';
import Wishlist from '../models/Wishlist.js';

const router = express.Router();

// ✅ GET wishlist by userId
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: 'userId is required' });

    const wishlist = await Wishlist.findOne({ userId });
    res.json(wishlist ? wishlist.productIds : []);
  } catch (err) {
    console.error('Error fetching wishlist:', err);
    res.status(500).json({ message: 'Error fetching wishlist', error: err });
  }
});

// ✅ ADD product to wishlist
router.post('/add', async (req, res) => {
  try {
    const { userId, productId } = req.body;
    if (!userId || !productId) {
      return res.status(400).json({ message: 'userId and productId are required' });
    }

    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = new Wishlist({ userId, productIds: [productId] });
    } else if (!wishlist.productIds.includes(productId)) {
      wishlist.productIds.push(productId);
    }

    await wishlist.save();
    res.json(wishlist.productIds);
  } catch (err) {
    console.error('Error adding to wishlist:', err);
    res.status(500).json({ message: 'Error adding to wishlist', error: err });
  }
});

// ✅ REMOVE product from wishlist
router.delete('/remove/:productId', async (req, res) => {
  try {
    const { userId } = req.query;
    const { productId } = req.params;

    if (!userId || !productId) {
      return res.status(400).json({ message: 'userId and productId are required' });
    }

    const wishlist = await Wishlist.findOne({ userId });
    if (wishlist) {
      wishlist.productIds = wishlist.productIds.filter(id => id !== productId);
      await wishlist.save();
    }

    res.json(wishlist ? wishlist.productIds : []);
  } catch (err) {
    console.error('Error removing from wishlist:', err);
    res.status(500).json({ message: 'Error removing from wishlist', error: err });
  }
});

export default router;*/
/*
// routes/wishlist.js
import express from 'express';
import Wishlist from '../models/Wishlist.js';
const router = express.Router();

// get wishlist
router.get('/', async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne();
    res.json(wishlist ? wishlist.productIds : []);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch wishlist', error: err });
  }
});

// add product to wishlist
router.post('/add', async (req, res) => {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne();
    if (!wishlist) {
      wishlist = new Wishlist({ productIds: [productId] });
    } else if (!wishlist.productIds.includes(productId)) {
      wishlist.productIds.push(productId);
    }
    await wishlist.save();
    res.json(wishlist.productIds);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add product', error: err });
  }
});

// remove product from wishlist
router.delete('/remove/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const wishlist = await Wishlist.findOne();
    if (wishlist) {
      wishlist.productIds = wishlist.productIds.filter(id => id !== productId);
      await wishlist.save();
    }
    res.json(wishlist ? wishlist.productIds : []);
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove product', error: err });
  }
});

export default router;
*/
import express from 'express';
const router = express.Router();

// Example: get user's wishlist
router.get('/', (req, res) => {
  res.json({ message: 'Your wishlist items' });
});

// Example: add product to wishlist
router.post('/add', (req, res) => {
  const { productId } = req.body;
  res.json({ message: `Added product ${productId} to wishlist` });
});

// Example: remove product from wishlist
router.delete('/remove/:id', (req, res) => {
  const productId = req.params.id;
  res.json({ message: `Removed product ${productId} from wishlist` });
});

export default router;



