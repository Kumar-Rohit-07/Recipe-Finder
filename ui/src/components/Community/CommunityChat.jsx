import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import socket from "../../utils/socket";
import { formatDistanceToNow } from "date-fns";
import { Plus, Trash2, Edit2, X, Check } from "lucide-react"; // icons

export default function CommunityChat() {
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [onlineCount, setOnlineCount] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const endRef = useRef(null);

  // =====================================================
  // 🧠 Fetch old messages
  // =====================================================
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/community/chat", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
      } catch (error) {
        console.error("❌ Error fetching chat messages:", error);
      }
    };
    if (token) fetchMessages();
  }, [token]);

  // =====================================================
  // 🔁 Socket listeners
  // =====================================================
  useEffect(() => {
    socket.on("receive-message", (msg) =>
      setMessages((prev) => [...prev, msg])
    );
    socket.on("message-deleted", (messageId) =>
      setMessages((prev) => prev.filter((m) => m._id !== messageId))
    );
    socket.on("message-edited", (updatedMsg) =>
      setMessages((prev) =>
        prev.map((m) => (m._id === updatedMsg._id ? updatedMsg : m))
      )
    );
    socket.on("online-count", (count) => setOnlineCount(count));

    return () => {
      socket.off("receive-message");
      socket.off("message-deleted");
      socket.off("message-edited");
      socket.off("online-count");
    };
  }, []);

  // =====================================================
  // 🧩 Register user for online tracking
  // =====================================================
  useEffect(() => {
    const userId = user?._id || user?.id;
    if (userId) socket.emit("register-user", userId);
  }, [user]);

  // =====================================================
  // 🧾 Auto-scroll
  // =====================================================
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // =====================================================
  // 📤 Send message
  // =====================================================
  const handleSend = async () => {
    const userId = user?._id || user?.id;
    if (!user || !userId) return;

    if (!message && !image) return;

    let imageUrl = null;
    if (image) {
      try {
        const formData = new FormData();
        formData.append("image", image);
        const res = await axios.post(
          "http://localhost:5000/api/community/chat/upload",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        imageUrl = res.data.imageUrl;
      } catch (err) {
        console.error("❌ Image upload failed:", err);
        return;
      }
    }

    const msgData = { userId, username: user.username, message, imageUrl };
    socket.emit("send-message", msgData);
    setMessage("");
    setImage(null);
    setPreview(null);
    document.getElementById("imageUpload").value = "";
  };

  // =====================================================
  // 🗑️ Delete message
  // =====================================================
  const handleDelete = (id) => {
    socket.emit("delete-message", id);
  };

  // =====================================================
  // ✏️ Edit message
  // =====================================================
  const handleEditStart = (msg) => {
    setEditingId(msg._id);
    setEditText(msg.message);
  };
  const handleEditCancel = () => {
    setEditingId(null);
    setEditText("");
  };
  const handleEditSave = () => {
    if (!editText.trim()) return;
    socket.emit("edit-message", { id: editingId, newText: editText });
    setEditingId(null);
    setEditText("");
  };

  // =====================================================
  // 📸 Handle image preview
  // =====================================================
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  // =====================================================
  // 🧱 UI
  // =====================================================
  if (!user || !token) {
    return (
      <div className="flex items-center justify-center h-[85vh] text-gray-500">
        Loading chat...
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-[85vh] w-full max-w-2xl mx-auto 
    rounded-xl shadow-xl overflow-hidden bg-gradient-to-br from-teal-50 to-green-100">

      {/* 🌍 Chat Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white shadow-sm rounded-t-lg">
        <h2 className="text-lg font-semibold text-gray-800">🌍 Community Chat</h2>
        <div className="text-sm text-gray-500 font-medium">
          🟢 {onlineCount} Online
        </div>
      </div>

      {/* 💬 Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map((msg) => {
          const isOwn =
            msg.user?._id === user?._id || msg.username === user?.username;

          const profilePic =
            msg?.user?.profilePic
              ? `http://localhost:5000${msg.user.profilePic}`
              : "https://via.placeholder.com/40?text=👤";

          return (
            <div
              key={msg._id || Math.random()}
              className={`flex flex-col mb-4 ${isOwn ? "items-end" : "items-start"}`}
            >
              {/* 🧑‍💬 User Info Row */}
              <div className={`flex items-center gap-2 mb-1 ${isOwn ? "flex-row-reverse" : ""}`}>
                <img
                  src={profilePic}
                  alt="profile"
                  className="w-8 h-8 rounded-full object-cover border border-gray-300 shadow-sm"
                />
                <div className="flex flex-col">
                  <p
                    className={`text-xs font-semibold ${
                      isOwn ? "text-blue-600 text-right" : "text-gray-700"
                    }`}
                  >
                    {msg?.user?.username || msg.username || "Anonymous"}
                  </p>
                  {msg?.createdAt && (
                    <p className="text-[10px] text-gray-400">
                      {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                    </p>
                  )}
                </div>
              </div>

              {/* 💬 Message Content */}
              {editingId === msg._id ? (
                <div className="flex gap-2 items-center">
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="border rounded-md px-2 py-1 text-sm text-black"
                  />
                  <button
                    onClick={handleEditSave}
                    className="text-green-600 hover:text-green-800"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={handleEditCancel}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  {msg.message && (
                    <div
                      className={`px-3 py-2 rounded-2xl shadow-sm max-w-xs break-words flex flex-col ${
                        isOwn
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-white text-gray-800 rounded-bl-none"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span>{msg.message}</span>
                        {isOwn && (
                          <div className="flex items-center gap-1 ml-2">
                            <button onClick={() => handleEditStart(msg)}>
                              <Edit2 size={14} className="text-white/80 hover:text-white" />
                            </button>
                            <button onClick={() => handleDelete(msg._id)}>
                              <Trash2 size={14} className="text-white/80 hover:text-red-300" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {msg.imageUrl && (
                    <div className="relative mt-2">
                      <img
                        src={`http://localhost:5000${msg.imageUrl}`}
                        alt="chat-img"
                        className="rounded-xl max-w-[200px] shadow-sm"
                      />
                      {isOwn && (
                        <button
                          onClick={() => handleDelete(msg._id)}
                          className="absolute top-1 right-1 bg-white/70 rounded-full p-1 hover:bg-red-100"
                        >
                          <Trash2 size={14} className="text-red-600" />
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* ✉️ Input Bar */}
      <div className="flex items-center gap-2 p-3 border-t bg-gradient-to-br from-teal-100 via-emerald-50 to-blue-100">
        <div className="relative">
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => document.getElementById("imageUpload").click()}
            className="p-2 rounded-full bg-white/60 hover:bg-white transition shadow-sm"
          >
            <Plus size={18} className="text-gray-600" />
          </button>
        </div>

        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm 
          bg-gradient-radial from-teal-400 via-sky-400 to-indigo-500 text-white placeholder-white/60 
          focus:outline-none focus:ring-2 focus:ring-white/80 shadow-inner"
        />

        <button
          onClick={handleSend}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm transition"
        >
          Send
        </button>
      </div>

      {preview && (
        <div className="absolute bottom-20 right-4 bg-white p-2 shadow-md rounded-lg">
          <img
            src={preview}
            alt="preview"
            className="w-24 h-24 object-cover rounded-md"
          />
        </div>
      )}
    </div>
  );
}
