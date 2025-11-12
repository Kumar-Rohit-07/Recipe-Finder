import React, { useState, useEffect } from "react";
import API from "../../utils/api";
import CommentItem from "./CommentItem";

const CommentSection = ({ recipeId }) => {
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        // ✅ Matches: app.use("/api/community/comments", ...)
        const res = await API.get(`/community/comments/${recipeId}`);
        setComments(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.log("Error loading comments:", err);
      }
    };
    fetchComments();
  }, [recipeId]);

  const postComment = async () => {
    if (!input.trim()) return;
    try {
      const res = await API.post(`/community/comments/${recipeId}`, { text: input });
      setComments((prev) => [res.data, ...prev]);
      setInput("");
    } catch (err) {
      console.log("Error posting comment:", err);
    }
  };

  return (
    <div className="mt-4 border-t border-gray-300 pt-4">
      <div className="flex gap-3 mb-4">
        <input
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
          placeholder="Add a comment..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={postComment} className="px-4 py-2 bg-teal-600 text-white rounded-lg">
          Post
        </button>
      </div>

      <div className="space-y-4">
        {comments.map((c) => (
          <CommentItem key={c._id} comment={c} recipeId={recipeId} />
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
