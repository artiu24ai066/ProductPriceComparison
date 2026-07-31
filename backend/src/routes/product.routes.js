import { Router } from "express";
import { getHomeTrendingStats, searchProducts } from "../controllers/product.controller.js";
import { verifyJWTOptional } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/home-trending", getHomeTrendingStats);
router.get("/search-results", verifyJWTOptional, searchProducts);

export default router;
