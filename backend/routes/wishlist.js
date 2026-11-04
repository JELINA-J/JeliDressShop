import express from "express";
import verifyToken from "../middleware/authMiddleware.js";
import Wishlist from "../models/Wishlist.js";
import { Product } from "../models/Product.js";
const router = express.Router();

// GET wishlist
router.get("/", verifyToken, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.userId })
      .populate("items.productId");   // ⭐ VERY IMPORTANT

    if (!wishlist) return res.json([]);

    const products = wishlist.items.map(item => item.productId);

    res.json(products);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching wishlist" });
  }
});

// ADD to wishlist
router.post("/add", verifyToken, async (req, res) => {
  try {
    const { productId } = req.body;

    let wishlist = await Wishlist.findOne({ user: req.user.userId });

    if (!wishlist) {
      wishlist = new Wishlist({
        user: req.user.userId,
        items: [{ productId }]
      });
    } else {
      if (!wishlist.items.some(item => item.productId.toString() === productId)) {
        wishlist.items.push({ productId });
      }
    }

    await wishlist.save();
    res.json({ message: "Added to wishlist" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding to wishlist" });
  }
});

// REMOVE from wishlist
router.delete("/remove/:id", verifyToken, async (req, res) => {
  try {
    const productId = req.params.id;

    const wishlist = await Wishlist.findOne({ user: req.user.userId });

    if (!wishlist) return res.json({ message: "No wishlist found" });

    wishlist.items = wishlist.items.filter(
      item => item.productId.toString() !== productId
    );

    await wishlist.save();
    res.json({ message: "Removed from wishlist" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error removing from wishlist" });
  }
});

export default router;