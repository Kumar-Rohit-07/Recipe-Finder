import express from "express";
import { getDishesByCountry } from "../controllers/countryController.js";

const router = express.Router();

// ✅ Route to fetch dishes by country + optional category
// Example: GET /api/countries/dishes?country=British&category=non-veg
router.get("/dishes", getDishesByCountry);

export default router;
