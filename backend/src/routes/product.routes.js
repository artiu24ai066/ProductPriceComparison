import { Router } from "express";
import { searchProducts } from "../controllers/product.controller.js";
import { verifyJWTOptional } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/search-results", verifyJWTOptional, searchProducts);

export default router;
