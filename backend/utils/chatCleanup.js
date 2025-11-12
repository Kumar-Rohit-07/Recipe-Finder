import CommunityChat from "../models/communityChatModel.js";

const MAX_MESSAGES = 600;
const DELETE_BATCH = 100;

// 🧹 Automatically delete oldest 100 messages when limit exceeds 600
export const cleanupOldMessages = async () => {
  const totalCount = await CommunityChat.countDocuments();

  if (totalCount > MAX_MESSAGES) {
    const oldest = await CommunityChat.find()
      .sort({ createdAt: 1 })
      .limit(DELETE_BATCH);

    const idsToDelete = oldest.map((msg) => msg._id);
    await CommunityChat.deleteMany({ _id: { $in: idsToDelete } });

    console.log(`🧹 Deleted ${idsToDelete.length} oldest chat messages`);
  }
};
