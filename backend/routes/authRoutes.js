import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);

// Example protected route (optional)
router.get("/profile", protect, (req, res) => {
  res.json({ message: `Welcome, ${req.user.name}` });
});

export default router;
