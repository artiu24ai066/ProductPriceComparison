import { Router } from "express";
import { searchProducts } from "../controllers/product.controller.js";

const router = Router();

router.get("/search-results", searchProducts);

export default router;
