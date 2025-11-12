import mongoose from "mongoose";

const communityChatSchema = new mongoose.Schema(
  {
    // 👤 Reference to User model
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🔤 Store username for quick access (redundant but useful if user deleted)
    username: {
      type: String,
      required: true,
    },

    // 💬 Message text
    message: {
      type: String,
      default: "",
      trim: true,
    },

    // 🖼️ Image URL (optional)
    imageUrl: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // ✅ adds createdAt & updatedAt automatically
  }
);

// 🧠 Optional: always populate 'user' field with name, username, profilePic
communityChatSchema.pre(/^find/, function (next) {
  this.populate("user", "name username profilePic");
  next();
});

export default mongoose.model("CommunityChat", communityChatSchema);
