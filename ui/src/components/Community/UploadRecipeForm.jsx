import React, { useState } from "react";
import API from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

export default function UploadRecipeForm({ onClose, onUploaded }) {
  const { token } = useAuth();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("vegetarian");
  const [country, setCountry] = useState("");
  const [videoLink, setVideoLink] = useState("");

  const [ingredients, setIngredients] = useState([{ name: "", measure: "" }]);
  const [steps, setSteps] = useState([""]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const addIngredient = () => setIngredients([...ingredients, { name: "", measure: "" }]);
  const addStep = () => setSteps([...steps, ""]);

  const handleIngredientChange = (i, field, value) => {
    const arr = [...ingredients];
    arr[i][field] = value;
    setIngredients(arr);
  };

  const handleStepChange = (i, value) => {
    const arr = [...steps];
    arr[i] = value;
    setSteps(arr);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("country", country);
    formData.append("videoLink", videoLink);
    formData.append("ingredients", JSON.stringify(ingredients));
    formData.append("steps", JSON.stringify(steps));
    if (image) formData.append("image", image);

    const res = await API.post("/community/recipes", formData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // ✅ Send the newly created recipe back up
    onUploaded(res.data);

    setLoading(false);
    onClose(); // ✅ Close modal → returns to first section
  } catch (err) {
    setLoading(false);
    alert("Failed to upload recipe");
    console.error(err);
  }
};



  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center backdrop-blur-sm z-50">
      <div className="bg-gradient-to-b from-green-200 to-gray-100 shadow-xl border border-gray-300 rounded-xl p-6 w-full max-w-xl max-h-[88vh] overflow-y-auto">
        
        <h2 className="text-lg font-semibold mb-4 text-amber-800 text-center">Upload Recipe</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          
          {/* Name + Category */}
          <div className="flex gap-3">
            <input
              className="flex-1 p-2 border border-gray-300 rounded-md bg-white text-amber-800 text-sm"
              placeholder="Recipe Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <select
              className="w-36 p-2 border border-gray-300 rounded-md bg-white text-amber-800 text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="vegetarian">Vegetarian</option>
              <option value="non-veg">Non-Veg</option>
              <option value="drinks">Drinks</option>
              <option value="desserts">Desserts</option>
            </select>
          </div>

          {/* Country */}
          <input
            className="w-full p-2 border border-gray-300 rounded-md bg-white text-amber-800 text-sm"
            placeholder="Country / Cuisine"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />

          {/* Ingredients */}
          <div>
            <p className="text-sm font-medium text-amber-800 mb-1">Ingredients</p>
            {ingredients.map((ing, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  className="flex-1 p-2 border border-gray-300 rounded-md bg-white text-amber-800 text-sm"
                  placeholder="Ingredient"
                  onChange={(e) => handleIngredientChange(i, "name", e.target.value)}
                />
                <input
                  className="w-24 p-2 border border-gray-300 rounded-md bg-white text-amber-800 text-sm"
                  placeholder="Qty"
                  onChange={(e) => handleIngredientChange(i, "measure", e.target.value)}
                />
              </div>
            ))}
            <button type="button" onClick={addIngredient} className="text-sm text-green-700 font-medium">
              + Add Ingredient
            </button>
          </div>

          {/* Steps */}
          <div>
            <p className="text-sm font-medium text-amber-800 mb-1">Steps</p>
            {steps.map((step, i) => (
              <textarea
                key={i}
                className="w-full p-2 border border-gray-300 rounded-md bg-white text-amber-800 text-sm mb-2"
                placeholder={`Step ${i + 1}`}
                onChange={(e) => handleStepChange(i, e.target.value)}
              />
            ))}
            <button type="button" onClick={addStep} className="text-sm text-green-700 font-medium">
              + Add Step
            </button>
          </div>

          {/* Upload Image */}
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="text-sm text-amber-800" />

          {/* Video Link */}
          <input
            className="w-full p-2 border border-gray-300 rounded-md bg-white text-amber-800 text-sm"
            placeholder="Video Link (optional)"
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
          />

          <button className="w-full py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition">
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>

        <button className="mt-3 w-full text-sm text-gray-600" onClick={onClose}>
          Cancel
        </button>

      </div>
    </div>
  );
}
