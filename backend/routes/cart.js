import express from 'express';
const router = express.Router();

// Example: get user's cart
router.get('/', (req, res) => {
  res.json({ message: 'Your cart items' });
});

// Example: add product to cart
router.post('/add', (req, res) => {
  const { productId } = req.body;
  res.json({ message: `Added product ${productId} to cart` });
});

// Example: remove product from cart
router.delete('/remove/:id', (req, res) => {
  const productId = req.params.id;
  res.json({ message: `Removed product ${productId} from cart` });
});

export default router;
