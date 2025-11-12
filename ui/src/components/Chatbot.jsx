import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVolumeUp,
  FaVolumeMute,
  FaRobot,
} from "react-icons/fa";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isVoiceInput, setIsVoiceInput] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [muted, setMuted] = useState(false);

  const recognitionRef = useRef(null);

  // ✅ Voice Recognition Setup
  useEffect(() => {
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "hi-IN";
    recognition.continuous = true;
    recognition.interimResults = true;

    let finalTranscript = "";

    recognition.onresult = (event) => {
      let interimTranscript = "";

      for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      setInput(finalTranscript + interimTranscript);
      setIsVoiceInput(true);
    };

    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
  }, []);

  // ✅ Toggle Mic
  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setInput("");
      setIsVoiceInput(true);
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // ✅ Speak Response (ONLY if user used voice)
  const speakText = (text) => {
    if (muted || !isVoiceInput) return;

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "hi-IN";
    setIsSpeaking(true);

    utter.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utter);
  };

  // ✅ Send Message
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", message: input };
    setMessages((prev) => [...prev, userMsg]);

    if (isListening) recognitionRef.current.stop();

    const voiceMode = isVoiceInput;
    setInput("");
    setIsVoiceInput(false);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/ai/chat",
        { message: userMsg.message },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      const reply = res.data.reply || "I didn't catch that.";

      setMessages((prev) => [...prev, { sender: "bot", message: reply }]);

      if (voiceMode) speakText(reply);
    } catch {
      setMessages((prev) => [...prev, { sender: "bot", message: "Server error, try again." }]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 w-[22rem] h-[28rem] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">

      {/* HEADER */}
      <div className="bg-purple-600 text-white px-4 py-2 font-bold flex justify-between items-center relative">
        <span className="flex items-center gap-2">
          <FaRobot /> ChefBot
        </span>

        {isSpeaking && (
          <button
            onClick={() => setMuted(!muted)}
            className="absolute right-10 text-lg hover:opacity-80"
          >
            {muted ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>
        )}

        <button onClick={onClose} className="text-xl hover:text-gray-200">
          ✕
        </button>
      </div>

      {/* MESSAGES */}
      <div className="flex-grow p-3 overflow-y-auto space-y-2 text-sm">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded-lg shadow-md max-w-[75%] ${
              msg.sender === "user"
                ? "bg-purple-500 text-white self-end ml-auto"
                : "bg-blue-500 text-white self-start"
            }`}
          >
            {msg.message}
          </div>
        ))}
      </div>

      {/* INPUT AREA */}
      <div className="p-2 border-t border-gray-200 flex items-center gap-2">
        <button
          onClick={toggleMic}
          className={`p-2 rounded-full text-white ${
            isListening ? "bg-red-600" : "bg-gray-600"
          }`}
        >
          {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
        </button>

        <input
          type="text"
          className="flex-grow px-3 py-2 rounded-lg bg-gray-100 text-gray-900"
          placeholder="Type or Speak..."
          value={input}
          onChange={(e) => { setInput(e.target.value); setIsVoiceInput(false); }}
        />

        <button onClick={sendMessage} className="px-4 py-2 bg-purple-600 text-white rounded-lg">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
