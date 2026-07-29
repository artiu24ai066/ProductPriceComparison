import { Router } from "express";
import { searchProducts } from "../controllers/product.controller.js";

const router = Router();

// Frontend calls: GET /api/v1/products/search?q=...
router.get("/search", searchProducts);

export default router;
