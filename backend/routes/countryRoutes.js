import express from "express";
import { getDishesByCountry, getRandomDishes } from "../controllers/countryController.js";

const router = express.Router();

router.get("/dishes", getDishesByCountry);
router.get("/random", getRandomDishes);

export default router;
