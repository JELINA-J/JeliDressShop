import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: Number,
  name: String,
  brand: String,
  price: Number,
  rating: Number,
  discount: Number,
  category: [String],
  sections: [String],
  description: String,          // NEW field
  images: [String]              // NEW field (array of image URLs)
});


export const Product = mongoose.model('products', productSchema);


export const Productview = mongoose.model('productview', productSchema);
