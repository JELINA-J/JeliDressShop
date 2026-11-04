import express from 'express';
import { Product, Productview } from '../models/Product.js';

const router = express.Router();

// backend/routes/products.js


router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) res.json(product);
    else res.status(404).json({ error: 'Product not found' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


router.get('/category/:category', async (req, res) => {
  try {
    const products = await Product.find({ category: { $in: [req.params.category] } });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products by category' });
  }
});

router.get('/api/products/category/shop', async (req, res) => {
  try {
    const products = await Product.find({ category: { $in: ['shop'] } }).sort({ id: 1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch shop products' });
  }
});
router.get('/api/products/category/new', async (req, res) => {
  try {
    const products = await Product.find({ category: { $in: ['new'] } }).sort({ id: 1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch shop products' });
  }
});

router.get('/section/:sectionName', async (req, res) => {
  try {
    const products = await Product.find({ sections: req.params.sectionName });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products by section' });
  }
});


export default router;
