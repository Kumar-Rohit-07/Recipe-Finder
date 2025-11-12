import React, { useState } from "react";
import API from "../../utils/api";

const CommentItem = ({ comment, recipeId }) => {
  const [showReply, setShowReply] = useState(false);
  const [reply, setReply] = useState("");

  const sendReply = async () => {
    if (!reply.trim()) return;
    try {
      const res = await API.post(`/community/comments/reply/${comment._id}`, { text: reply });
      comment.replies = [res.data, ...(comment.replies || [])];
      setReply("");
      setShowReply(false);
    } catch (err) {
      console.log("Error posting reply:", err);
    }
  };

  // 🧠 Graceful fallback for user profile image
  const userImage =
    comment.user?.profileImageUrl ||
    comment.user?.profilePic ||
    comment.user?.profileImage ||
    "https://via.placeholder.com/30?text=👤";

  return (
    <div className="mb-3">
      {/* 💬 Main Comment */}
      <div className="flex items-start gap-2">
        {/* Profile Picture */}
        <img
          src={`http://localhost:5000${userImage}`}
          alt="User"
          className="w-8 h-8 rounded-full object-cover border border-gray-200"
        />

        <div className="flex-1">
          {/* Username & Text */}
          <div className="bg-white rounded-lg px-3 py-1.5 shadow-sm border border-gray-100">
            <p className="text-xs font-semibold text-gray-900 leading-tight">
              {comment.user?.name || "Anonymous"}
            </p>
            <p className="text-[13px] text-gray-700 leading-snug">{comment.text}</p>
          </div>

          {/* Reply Button */}
          <button
            onClick={() => setShowReply(!showReply)}
            className="text-[11px] text-teal-600 mt-1 ml-1 hover:underline"
          >
            Reply
          </button>

          {/* ✏️ Reply Box */}
          {showReply && (
            <div className="mt-2 flex gap-2 ml-9">
              <input
                className="border border-gray-300 rounded-lg px-2 py-1 text-sm flex-1"
                placeholder="Write a reply..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
              />
              <button
                onClick={sendReply}
                className="px-3 py-1 bg-teal-600 text-white rounded-lg text-sm"
              >
                Send
              </button>
            </div>
          )}

          {/* 🧵 Nested Replies */}
          {comment.replies?.length > 0 && (
            <div className="ml-9 mt-2 space-y-2">
              {comment.replies.map((r) => {
                const replyImage =
                  r.user?.profileImageUrl ||
                  r.user?.profilePic ||
                  r.user?.profileImage ||
                  "https://via.placeholder.com/25?text=👤";

                return (
                  <div key={r._id} className="flex items-start gap-2">
                    <img
                      src={`http://localhost:5000${replyImage}`}
                      alt="Reply User"
                      className="w-7 h-7 rounded-full object-cover border border-gray-200"
                    />
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-100">
                        <p className="text-xs font-semibold text-gray-800 leading-tight">
                          {r.user?.name || "Anonymous"}
                        </p>
                        <p className="text-[13px] text-gray-700 leading-snug">{r.text}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
