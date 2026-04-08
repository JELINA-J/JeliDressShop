import express from "express";
import Cart from "../models/Cart.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();


// ✅ Get Logged-in User Cart
router.get("/", verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId });

    if (!cart) return res.json([]);

    res.json(cart.items);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching cart" });
  }
});


// ✅ Save / Update Cart
router.post("/save", verifyToken, async (req, res) => {
  try {
    console.log("🔥 SAVE ROUTE HIT");
    console.log("User:", req.user.userId);
    console.log("Items:", req.body.items);

    const { items } = req.body;

const existingCart = await Cart.findOne({ user: req.user.userId });
    if (existingCart) {
      existingCart.items = items;
      await existingCart.save();
    } else {
      const newCart = new Cart({
  user: req.user.userId,   // ✅ MATCHES SCHEMA
  items: items
});

      await newCart.save();
    }

    res.json({ message: "Cart saved successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving cart" });
  }
});
router.post("/add", verifyToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ user: req.user.userId });

    if (!cart) {
      cart = new Cart({
        user: req.user.userId,
        items: []
      });
    }

    const existingItem = cart.items.find(
      item => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();

    res.json({ message: "Added to cart" });

  } catch (error) {
    res.status(500).json({ message: "Error adding to cart" });
  }
});


export default router;