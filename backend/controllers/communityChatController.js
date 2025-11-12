import CommunityChat from "../models/CommunityChatModel.js";
import fs from "fs";
import path from "path";

const MAX_MESSAGES = 600; // keep last 600
const DELETE_BATCH = 100; // remove 100 oldest

// 🟢 Get last 500 messages (oldest → newest)
export const getMessages = async (req, res) => {
  try {
    const messages = await CommunityChat.find()
      .sort({ createdAt: 1 })
      .limit(500)
      .populate("user", "name profilePic username"); // ✅ include profile image + name
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🟢 Save message and handle cleanup (used in Socket.io too)
export const saveMessage = async (data) => {
  const { userId, username, message, imageUrl } = data;
  console.log("📩 Received message:", { userId, username, message, imageUrl });

  // Save message
  const newMsg = await CommunityChat.create({
    user: userId,
    username,
    message,
    imageUrl,
  });

  // ✅ populate user info before returning so sockets can broadcast it immediately
  await newMsg.populate("user", "name profilePic username");

  // Cleanup old messages
  const totalCount = await CommunityChat.countDocuments();
  if (totalCount > MAX_MESSAGES) {
    const oldest = await CommunityChat.find()
      .sort({ createdAt: 1 })
      .limit(DELETE_BATCH);
    const idsToDelete = oldest.map((msg) => msg._id);
    await CommunityChat.deleteMany({ _id: { $in: idsToDelete } });
  }

  return newMsg;
};

// 🟢 Image upload handler (multer middleware handles the file)
export const uploadImage = (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const imageUrl = `/uploads/community-chat/${req.file.filename}`;
  res.json({ imageUrl });
};

// 🗑️ Delete message (text or image)
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id; // from auth middleware

    const message = await CommunityChat.findById(id);
    if (!message) return res.status(404).json({ message: "Message not found" });

    // Only message owner can delete
    if (message.user.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this message" });
    }

    // If it had an image, remove file too
    if (message.imageUrl) {
      const filePath = path.join(process.cwd(), message.imageUrl);
      fs.unlink(filePath, (err) => {
        if (err) console.warn("⚠️ Failed to remove image file:", err.message);
      });
    }

    await message.deleteOne();
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✏️ Edit text message (only if it’s a text message)
export const editMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { newText } = req.body;
    const userId = req.user?.id;

    const message = await CommunityChat.findById(id);
    if (!message) return res.status(404).json({ message: "Message not found" });

    // Don’t allow editing image messages
    if (message.imageUrl) {
      return res.status(400).json({ message: "Cannot edit image messages" });
    }

    // Only message owner can edit
    if (message.user.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to edit this message" });
    }

    message.message = newText;
    await message.save();

    res.json({ success: true, message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Utility for socket calls (optional)
export const deleteMessageById = async (id) => {
  return await CommunityChat.findByIdAndDelete(id);
};

export const updateMessageById = async ({ id, newText }) => {
  return await CommunityChat.findByIdAndUpdate(id, { message: newText }, { new: true });
};
