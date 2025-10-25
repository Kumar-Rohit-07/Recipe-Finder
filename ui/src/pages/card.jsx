/* src/pages/Card.jsx */
import ReactMarkdown from "react-markdown";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Search, Bot, Star } from "lucide-react";
import { MapPin } from 'lucide-react'; // Importing the MapPin icon from lucide-react

const Card = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();

  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Chatbot states
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/meals/category/${category}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        const rawMeals = res.data.meals || [];
        const formattedMeals = rawMeals.map((m) => ({
          id: m.idMeal || m._id,
          name: m.strMeal || m.name || "Unnamed Meal",
          image: m.strMealThumb || m.image || "https://via.placeholder.com/300x200?text=No+Image",
          description:
            m.description ||
            (m.strInstructions ? m.strInstructions.slice(0, 80) + "..." : "Delicious recipe to try out!"),
          avgRating: !isNaN(parseFloat(m.avgRating)) && m.avgRating !== null ? parseFloat(m.avgRating) : 0,
          aiCategory: m.aiCategory || m.strCategory || "Misc",
        }));
        formattedMeals.sort((a, b) => b.avgRating - a.avgRating);
        setMeals(formattedMeals);
      } catch (err) {
        setError("Failed to load meals. Try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, [category]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user", message: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/ai/chat",
        { message: input },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setMessages((prev) => [...prev, { sender: "bot", message: res.data.reply || "🤖 Sorry, I didn’t understand that." }]);
    } catch {
      setMessages((prev) => [...prev, { sender: "bot", message: "❌ Error connecting to AI service." }]);
    }
  };

  const filteredMeals = meals.filter((meal) =>
    meal.name?.toLowerCase().includes(search.toLowerCase())
  );

  const top5MealIds = [...meals].sort((a, b) => b.avgRating - a.avgRating).slice(0, 5).map((m) => m.id);

  if (loading) return <div className="text-white text-2xl text-center mt-20">Loading...</div>;
  if (error) return <div className="text-red-500 text-2xl text-center mt-20">{error}</div>;

  return (
    <div className="min-h-screen flex flex-col bg-animate">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-3xl bg-white/10 border-b border-white/20 shadow-md py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 relative">
          {/* Hamburger Icon */}
          <button
            onClick={() => setMenuOpen(true)}
            className= "fixed left-4 z-[9999] text-white hover:text-gray-300 transition md:left-5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-white">
            🍴 Recipe Finder
          </Link>

          {/* Search */}
          <div className="relative w-1/3 hidden md:block">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white" size={20} strokeWidth={2} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search recipes..."
              className="w-full pl-12 pr-4 py-2 bg-white/20 border border-white/30 text-white placeholder-white rounded-full font-bold focus:outline-none hover:bg-white/30 transition"
            />
          </div>

          <Link
            to="/countries" // Adjust the path as needed
            className="flex items-center gap-2 text-white font-semibold py-2 px-4 rounded-lg bg-gradient-to-r from-green-500 to-green-800 hover:bg-white/20 transition"
          >
            <MapPin size={20} /> {/* Google Maps location pin icon */}
            <span className="font-semibold">Cuisine Explorer</span>
            <span className="text-yellow-400 text-lg">🔥</span>
          </Link>

          {/* Auth/Profile */}
          {!user ? (
            <div className="flex gap-2">
              <Link to="/login" className="px-4 py-2 rounded-2xl bg-white text-gray-900 font-semibold hover:bg-gray-200 transition">Login</Link>
              <Link to="/signup" className="px-4 py-2 rounded-2xl bg-white text-gray-900 font-semibold hover:bg-gray-200 transition">Signup</Link>
            </div>
          ) : (
            <div className="relative">
              <div
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span className="text-xl">👤</span>
              </div>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white/20 backdrop-blur-lg rounded-lg shadow-lg py-2 flex flex-col">
                  <button
                    onClick={() => { navigate("/profile"); setDropdownOpen(false); }}
                    className="text-white px-4 py-2 text-left hover:bg-white/30"
                  >
                    Your Profile
                  </button>
                  <button
                    onClick={() => { logout(); navigate("/login", { replace: true }); setDropdownOpen(false); }}
                    className="text-white px-4 py-2 text-left hover:bg-white/30"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Sidebar Overlay */}
      {/* Sidebar Overlay */}
{menuOpen && (
  <>
    <div
      onClick={() => setMenuOpen(false)}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998] transition-opacity duration-300"
    ></div>

    <div className="fixed top-0 left-0 h-full w-72 sm:w-80 bg-white/10 backdrop-blur-xl shadow-2xl border-r border-white/20 z-[9999] p-6 flex flex-col space-y-6 animate-slideIn md:rounded-r-3xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white tracking-wide">🍽 Menu</h2>
        <button
          onClick={() => setMenuOpen(false)}
          className="text-white hover:text-gray-300 text-2xl font-bold"
        >
          ✕
        </button>
      </div>

      <div className="flex flex-col space-y-2">
        {[
          "vegetarian",
          "non-veg",
          "drinks",
          "desserts",
          "Find meals by ingredients",
          "restaurants",
          "team",
          "about"
        ].map((item) => {
          let label, path;
          switch (item) {
            case "Find meals by ingredients":
              label = "Find meals by ingredients";
              path = "/ingredients";
              break;
            case "restaurants":
              label = "Cuisine Explorer";
              path = "/countries";
              break;
            case "team":
              label = "Team";
              path = "/team";
              break;
            case "about":
              label = "About Us";
              path = "/about";
              break;
            default:
              label = item.charAt(0).toUpperCase() + item.slice(1);
              path = `/card/${item}`;
          }

          return (
            <button
              key={item}
              onClick={() => {
                navigate(path);
                setMenuOpen(false);
              }}
              className="text-left text-lg text-white font-semibold py-2 px-4 rounded-lg hover:bg-white/20 transition"
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  </>
)}


      {/* Main Content */}
      <div className="flex-grow backdrop-blur-md bg-white/10 m-10 shadow-2xl overflow-auto hide-scrollbar pt-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 w-full">
          {filteredMeals.length > 0 ? (
            filteredMeals.map((meal, i) => (
              <div key={i} className="relative flex flex-col items-center justify-between rounded-xl bg-white/20 text-white font-semibold shadow-md hover:bg-white/30 transition p-4">
                {top5MealIds.includes(meal.id) && (
                  <span className="absolute top-2 left-2 bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded-full shadow">
                    ⭐ Recommended
                  </span>
                )}
                <img src={meal.image} alt={meal.name} className="w-full h-32 object-cover rounded-md mb-2" />
                <span className="text-center text-lg font-bold mb-2">{meal.name}</span>
                <div className="flex items-center justify-between space-x-1 mb-2">
                  <Star className="text-yellow-400 fill-yellow-400" size={18} />
                  <span>{meal.avgRating > 0 ? meal.avgRating.toFixed(1) : "N/A"}</span>
                  <span className="text-white/70 text-sm">({meal.totalRatings || 0} ratings)</span>
                </div>
                <button
                  onClick={() => navigate(`/meal/${meal.id}`)}
                  className="mt-auto px-4 py-2 bg-white/20 text-white font-bold rounded-full hover:bg-white/30 transition duration-300 border border-white/10"
                >
                  View Details
                </button>
              </div>
            ))
          ) : (
            <p className="text-white text-xl col-span-full text-center min-h-[60vh]">No recipes found.</p>
          )}
        </div>
      </div>

      {/* Chatbot */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="w-14 h-14 flex items-center justify-center rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-700 transition"
        >
          <Bot size={28} />
        </button>

        {chatOpen && (
          <div className="absolute bottom-16 right-4 w-[22rem] h-[28rem] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
            <div className="bg-purple-600 text-white px-4 py-2 font-bold flex justify-between items-center">
              <span>🤖 Chatbot</span>
              <button onClick={() => setChatOpen(false)} className="text-white hover:text-gray-200 text-xl font-bold">✕</button>
            </div>
            <div className="flex-grow p-3 overflow-y-auto space-y-2 text-sm">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-2 rounded-lg shadow-md max-w-[75%] whitespace-pre-wrap ${
                    msg.sender === "user" ? "bg-purple-500 text-white self-end ml-auto" : "bg-blue-500 text-white self-start"
                  }`}
                >
                  <ReactMarkdown>{msg.message}</ReactMarkdown>
                </div>
              ))}
            </div>
            <div className="p-2 border-t border-gray-200 flex">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-grow px-3 py-2 rounded-l-lg bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none"
              />
              <button onClick={sendMessage} className="px-4 bg-purple-600 text-white rounded-r-lg hover:bg-purple-700">
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
