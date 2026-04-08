import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
productId: { 
  type: mongoose.Schema.Types.ObjectId,
  required: true 
},  name: String,
  price: Number,
  image: String,
  size: String,
  quantity: Number,
  discount: Number
});

const cartSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  items: [cartItemSchema]
}, { timestamps: true });

export default mongoose.model("Cart", cartSchema);