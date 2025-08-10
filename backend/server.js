import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import { Product, Productview } from './models/Product.js';
import productRoutes from './routes/products.js';
import wishlistRoutes from './routes/wishlist.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/wishlist', wishlistRoutes);

// Schema & Models


const Products = Product;
//const Productview = mongoose.model('productview', Product.schema);

// Routes

// Fetch all products

// Fetch single product view by id
// Fetch all products from productview


/*
// Fetch productview featured
app.get('/api/productview/category/featured', async (req, res) => {
  try {
    const products = await Productview.find({ category: 'featured' });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch featured products' });
  }
});*/

// Connect DB & start server
mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));
