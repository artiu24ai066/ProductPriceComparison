import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    getWishlist,
    toggleWishlist,
    removeWishlistItem,
    deleteSearchHistoryItem,
    clearSearchHistory,
    getSearchHistory,
    getRecentlyViewedProducts,
    syncRecentlyViewedProducts,
    // updateUserAvatar
} from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public Routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);

// Protected Routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/change-password").patch(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router.route("/wishlist").get(verifyJWT, getWishlist);
router.route("/wishlist/toggle").post(verifyJWT, toggleWishlist);
router.route("/wishlist/:productKey").delete(verifyJWT, removeWishlistItem);
router.route("/search-history").get(verifyJWT, getSearchHistory);
router.route("/search-history/:historyId").delete(verifyJWT, deleteSearchHistoryItem);
router.route("/search-history").delete(verifyJWT, clearSearchHistory);
router.route("/recently-viewed").get(verifyJWT, getRecentlyViewedProducts);
router.route("/recently-viewed").post(verifyJWT, syncRecentlyViewedProducts);

// We'll add this later after Multer & Cloudinary
// router.route("/avatar").patch(
//     verifyJWT,
//     upload.single("avatar"),
//     updateUserAvatar
// );

export default router;
