import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import multer from "multer";              // 🆕 for file upload
import path from "path";                  // 🆕
import fs from "fs";                      // 🆕

const router = express.Router();


// ✅ Ensure upload folder exists
const uploadDir = "uploads/profile_pics";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user._id}-${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });


// ✅ Existing: Get logged-in user profile
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password"); // hide password

    // 🆕 include boolean profilePic flag in response
    const responseUser = user.toObject();
    responseUser.profilePic = user.profilePic ? true : false;

    res.json(responseUser);
  } catch (err) {
    console.error("Profile Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
});


// ✅ 🆕 Upload / Update Profile Picture
router.patch("/profile-pic", protect, upload.single("profilePic"), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.profilePic = `/uploads/profile_pics/${req.file.filename}`;
    await user.save();

    res.json({
      success: true,
      message: "Profile picture updated successfully",
      profilePic: true, // boolean flag for frontend
      imageUrl: user.profilePic, // optional direct path if needed
    });
  } catch (error) {
    console.error("Profile picture upload error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
