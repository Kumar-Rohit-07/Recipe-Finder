import CommunityComment from "../models/CommunityComment.js";

// Add top-level comment
export const addComment = async (req, res) => {
  const { recipeId } = req.params;
  const { text } = req.body;

  const comment = await CommunityComment.create({
    recipe: recipeId,
    user: req.user._id,
    text,
    parentComment: null,
  });

  // ✅ populate name + profilePic
  await comment.populate("user", "name profilePic");
  res.json(comment);
};

// Add reply to a comment
export const addReply = async (req, res) => {
  const { commentId } = req.params;
  const { text } = req.body;

  try {
    const parent = await CommunityComment.findById(commentId);
    if (!parent) {
      console.error("❌ Parent comment not found:", commentId);
      return res.status(404).json({ message: "Parent comment not found" });
    }

    if (!parent.recipe) {
      console.error("❌ Parent comment missing recipe id:", parent);
      return res.status(400).json({ message: "Parent comment missing recipe id" });
    }

    const reply = await CommunityComment.create({
      recipe: parent.recipe,
      user: req.user._id,
      text,
      parentComment: commentId,
    });

    // ✅ populate name + profilePic
    await reply.populate("user", "name profilePic");
    res.json(reply);
  } catch (err) {
    console.error("❌ addReply error:", err);
    res.status(500).json({ message: "Error adding reply" });
  }
};

// Get all comments + replies grouped under their parent comment
export const getComments = async (req, res) => {
  const { recipeId } = req.params;

  let comments = await CommunityComment.find({
    recipe: recipeId,
    parentComment: null,
  })
    .populate("user", "name profilePic") // ✅ fixed here
    .sort({ createdAt: -1 });

  let replies = await CommunityComment.find({ parentComment: { $ne: null } })
    .populate("user", "name profilePic") // ✅ fixed here
    .sort({ createdAt: -1 });

  // Attach replies to each parent
  const replyMap = {};
  replies.forEach((r) => {
    if (!replyMap[r.parentComment]) replyMap[r.parentComment] = [];
    replyMap[r.parentComment].push(r);
  });

  comments = comments.map((c) => ({
    ...c.toObject(),
    replies: replyMap[c._id] || [],
  }));

  res.json(comments);
};
