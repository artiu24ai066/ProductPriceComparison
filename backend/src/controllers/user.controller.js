import { asyncHandler } from '../utils/asyncHandler.js';
import { APIerror } from '../utils/APIerror.js';
import { User } from '../models/user.model.js';
import { SearchHistory } from '../models/searchHistory.model.js';
import { Wishlist } from '../models/wishlist.model.js';
import { RecentlyViewed } from "../models/recentlyViewed.model.js";
// import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { uploadToCloudinary } from "../utils/cloudinary.js"
import { APIresponse } from "../utils/APIresponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const generateAccessAndRefereshTokens = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}
    }
    catch (error) {
        console.log("REAL ERROR:", error);
        throw new APIerror(500, "Something went wrong while generating referesh and access token");
    }
}



// ─── Helpers ──────────────────────────────────────────────────────────────

// Strips spaces, dashes, brackets — accepts 10–15 digit numbers with optional +
const isValidPhone = (value = "") => {
    const cleaned = value.replace(/[\s\-().]/g, "");
    return /^\+?\d{10,15}$/.test(cleaned);
};

const normalizePhone = (value = "") =>
    value.replace(/[\s\-().]/g, "").trim();

// ─── registerUser ──────────────────────────────────────────────────────────

const registerUser = asyncHandler(async (req, res) => {
    const { fullname, email, phone, password } = req.body;

    if ([fullname, email, phone, password].some((f) => !f?.trim())) {
        throw new APIerror(400, "All fields are required");
    }

    if (!isValidPhone(phone)) {
        throw new APIerror(400, "Please enter a valid phone number (10–15 digits)");
    }

    const normalizedPhone = normalizePhone(phone);

    // Check email and phone uniqueness together in one query
    const existedUser = await User.findOne({
        $or: [
            { email: email.toLowerCase().trim() },
            { phone: normalizedPhone },
        ],
    });

    if (existedUser) {
        if (existedUser.email === email.toLowerCase().trim()) {
            throw new APIerror(409, "An account with this email already exists");
        }
        throw new APIerror(409, "An account with this phone number already exists");
    }

    const user = await User.create({
        fullname,
        email,
        phone: normalizedPhone,
        password,
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new APIerror(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(
        new APIresponse(200, createdUser, "User registered Successfully")
    );
});



const loginUser = asyncHandler(async (req, res) => {
    // Accepts: { identifier, password }
    // identifier can be email or phone number
    const { identifier, password } = req.body;

    if (!identifier?.trim() || !password) {
        throw new APIerror(400, "Email/phone and password are required");
    }

    const cleaned = identifier.trim();

    // Detect whether the identifier is an email or a phone number
    const isEmail = cleaned.includes("@");
    const query   = isEmail
        ? { email: cleaned.toLowerCase() }
        : { phone: normalizePhone(cleaned) };

    const user = await User.findOne(query);

    if (!user) {
        throw new APIerror(404, "No account found with this email or phone number");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new APIerror(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new APIresponse(
                200,
                { user: loggedInUser, accessToken, refreshToken },
                "User logged In Successfully"
            )
        );
});


const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new APIresponse(200, {}, "User logged Out"))
});


const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new APIerror(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new APIerror(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new APIerror(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        }
    
        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)
    
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new APIresponse(
                    200,
                    { accessToken, refreshToken },
                    "Access token refreshed"
                )
            )
    }
    catch (error) {
        throw new APIerror(401, error?.message || "Invalid refresh token")
    }
});


const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new APIerror(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new APIresponse(200, {}, "Password changed successfully"))
});


const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new APIresponse(
        200,
        req.user,
        "User fetched successfully"
    ))
});


const updateAccountDetails = asyncHandler(async(req, res) => {
    // phone is intentionally omitted — it must never be changed after registration
    const { fullname, username, address } = req.body;

    if (!fullname?.trim()) {
        throw new APIerror(400, "Full name is required");
    }

    const updateFields = {
        fullname: fullname.trim(),
        ...(username !== undefined && { username: username.trim() }),
    };

    // Only update address fields that are explicitly provided
    if (address && typeof address === "object") {
        if (address.country !== undefined) updateFields["address.country"] = address.country.trim();
        if (address.state   !== undefined) updateFields["address.state"]   = address.state.trim();
        if (address.city    !== undefined) updateFields["address.city"]    = address.city.trim();
        if (address.pincode !== undefined) updateFields["address.pincode"] = address.pincode.trim();
    }

    // Safety: ensure phone is never in the update set
    delete updateFields.phone;

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        { $set: updateFields },
        { new: true }
    ).select("-password -refreshToken");

    return res
        .status(200)
        .json(new APIresponse(200, user, "Account details updated successfully"));
});

const SEARCH_HISTORY_RETENTION_MONTHS = 6;
const SEARCH_HISTORY_DUPLICATE_WINDOW_MS = 60 * 1000;

const getSearchHistoryRetentionCutoff = () => {
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - SEARCH_HISTORY_RETENTION_MONTHS);
    return cutoff;
};

const pruneAndLoadSearchHistory = async (userId) => {
    const retentionCutoff = getSearchHistoryRetentionCutoff();
    const history = await SearchHistory.find({ user: userId }).sort({ searchedAt: -1, createdAt: -1 });

    const visibleHistory = [];
    const expiredIds = [];

    for (const item of history) {
        const itemTime = new Date(item.searchedAt || item.createdAt).getTime();

        if (itemTime < retentionCutoff.getTime()) {
            expiredIds.push(item._id);
            continue;
        }

        const lastItem = visibleHistory[visibleHistory.length - 1];
        const currentNormalizedQuery = (item.normalizedQuery || item.query || "").toLowerCase().trim();

        if (lastItem) {
            const lastTime = new Date(lastItem.searchedAt || lastItem.createdAt).getTime();
            const lastNormalizedQuery = (lastItem.normalizedQuery || lastItem.query || "").toLowerCase().trim();
            const isSameQuery = currentNormalizedQuery && lastNormalizedQuery && currentNormalizedQuery === lastNormalizedQuery;
            const isRecentDuplicate = isSameQuery && lastTime - itemTime <= SEARCH_HISTORY_DUPLICATE_WINDOW_MS;

            if (isRecentDuplicate) {
                continue;
            }
        }

        visibleHistory.push(item);
    }

    if (expiredIds.length) {
        await SearchHistory.deleteMany({ _id: { $in: expiredIds }, user: userId });
    }

    return visibleHistory;
};

const normalizeWishlistKey = (value = "") => value.toString().trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

const stableHash = (value = "") => {
    const input = value.toString();
    let hash = 0;

    for (let index = 0; index < input.length; index += 1) {
        hash = ((hash << 5) - hash + input.charCodeAt(index)) | 0;
    }

    return Math.abs(hash).toString(16);
};

const canonicalizeWishlistValue = (value) => {
    if (Array.isArray(value)) {
        return value.map(canonicalizeWishlistValue);
    }

    if (value && typeof value === "object") {
        return Object.keys(value)
            .sort()
            .reduce((result, key) => {
                if (["lastUpdated", "createdAt", "updatedAt", "__v"].includes(key)) {
                    return result;
                }

                const normalizedValue = canonicalizeWishlistValue(value[key]);
                if (normalizedValue !== undefined) {
                    result[key] = normalizedValue;
                }
                return result;
            }, {});
    }

    if (value === undefined) {
        return undefined;
    }

    return value;
};

const getSellerUrls = (product = {}) => {
    const sellers = Array.isArray(product.sellers) ? product.sellers : [];
    return sellers
        .map((seller) => seller?.url || seller?.affiliateUrl || "")
        .filter(Boolean)
        .sort();
};

const buildWishlistKey = (product = {}) => {
    const primarySellerUrl = product.lowestPriceSeller?.url || product.cheapestAvailableSeller?.url || product.sellers?.[0]?.url || product.url || "";
    const baseKey = [
        product.groupId,
        product.canonicalTitle,
        primarySellerUrl,
    ]
        .filter(Boolean)
        .join("::");

    return `wk_${stableHash(baseKey || JSON.stringify(canonicalizeWishlistValue(product) || {}))}`;
};

const formatPriceText = (value) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
        return "";
    }

    return `₹${Number(value).toLocaleString("en-IN")}`;
};

const buildWishlistSnapshot = (product = {}) => {
    const productKey = buildWishlistKey(product);

    if (!productKey) {
        throw new APIerror(400, "Product data is required");
    }

    const primaryImage = product.images?.primary || product.images?.gallery?.[0] || product.image || "";
    const bestSeller = product.lowestPriceSeller || product.cheapestAvailableSeller || product.sellers?.[0] || {};
    const sourceUrl = bestSeller.url || bestSeller.affiliateUrl || product.url || "";
    const price = product.priceStats?.lowest ?? bestSeller.price ?? product.price ?? null;
    const title = product.canonicalTitle || product.name || product.title || product.rawTitle || "Product";

    return {
        productKey,
        title,
        brand: product.brand || "",
        image: primaryImage,
        price,
        priceText: formatPriceText(price),
        storeName: bestSeller.website || bestSeller.sellerName || "",
        sourceUrl,
        productSnapshot: product,
        metadata: {
            rating: product.overallRating ?? bestSeller.rating ?? null,
            reviewCount: bestSeller.reviewCount ?? null,
            availability: product.availability ?? bestSeller.availability ?? null,
        },
    };
};

const buildRecentlyViewedSnapshot = (product = {}) => {
    const bestSeller = product.lowestPriceSeller || product.cheapestAvailableSeller || product.sellers?.[0] || {};
    const sourceUrl = bestSeller.url || bestSeller.affiliateUrl || product.url || "";
    const title = product.canonicalTitle || product.name || product.title || product.rawTitle || "Product";
    const productKeyBase = [product.groupId, product.canonicalTitle, sourceUrl]
        .filter(Boolean)
        .join("::");

    const productKey = `rv_${stableHash(productKeyBase || JSON.stringify(canonicalizeWishlistValue(product) || {}))}`;
    const price = product.priceStats?.lowest ?? bestSeller.price ?? product.price ?? null;

    return {
        productKey,
        title,
        brand: product.brand || "",
        image: product.images?.primary || product.images?.gallery?.[0] || product.image || "",
        price,
        priceText: formatPriceText(price),
        storeName: bestSeller.website || bestSeller.sellerName || "",
        sourceUrl,
        productSnapshot: product,
        metadata: {
            rating: product.overallRating ?? bestSeller.rating ?? null,
            reviewCount: bestSeller.reviewCount ?? null,
            availability: product.availability ?? bestSeller.availability ?? null,
        },
    };
};

const mapWishlistItem = (item) => ({
    _id: item._id,
    productKey: item.productKey,
    title: item.title,
    brand: item.brand,
    image: item.image,
    price: item.price,
    priceText: item.priceText,
    storeName: item.storeName,
    sourceUrl: item.sourceUrl,
    productSnapshot: item.productSnapshot,
    metadata: item.metadata,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
});

const mapRecentlyViewedItem = (item) => ({
    _id: item._id,
    productKey: item.productKey,
    title: item.title,
    brand: item.brand,
    image: item.image,
    price: item.price,
    priceText: item.priceText,
    storeName: item.storeName,
    sourceUrl: item.sourceUrl,
    productSnapshot: item.productSnapshot,
    metadata: item.metadata,
    viewedAt: item.viewedAt,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
});

const syncRecentlyViewedProducts = asyncHandler(async (req, res) => {
    const products = Array.isArray(req.body?.products)
        ? req.body.products.filter(Boolean)
        : req.body?.product
            ? [req.body.product]
            : [];

    if (!products.length) {
        return res.status(200).json(
            new APIresponse(200, [], "Recently viewed products updated successfully")
        );
    }

    const uniqueSnapshots = new Map();

    products.slice(0, 50).forEach((product) => {
        const snapshot = buildRecentlyViewedSnapshot(product);
        uniqueSnapshots.set(snapshot.productKey, snapshot);
    });

    const operations = Array.from(uniqueSnapshots.values()).map((snapshot) => ({
        updateOne: {
            filter: {
                user: req.user._id,
                productKey: snapshot.productKey,
            },
            update: {
                $set: {
                    ...snapshot,
                    viewedAt: new Date(),
                    user: req.user._id,
                },
            },
            upsert: true,
        },
    }));

    if (operations.length) {
        await RecentlyViewed.bulkWrite(operations, { ordered: false });
    }

    const recentlyViewed = await RecentlyViewed.find({ user: req.user._id })
        .sort({ viewedAt: -1, updatedAt: -1 })
        .limit(50);

    return res.status(200).json(
        new APIresponse(
            200,
            recentlyViewed.map(mapRecentlyViewedItem),
            "Recently viewed products updated successfully"
        )
    );
});

const getRecentlyViewedProducts = asyncHandler(async (req, res) => {
    const recentlyViewed = await RecentlyViewed.find({ user: req.user._id })
        .sort({ viewedAt: -1, updatedAt: -1 })
        .limit(50);

    return res.status(200).json(
        new APIresponse(
            200,
            recentlyViewed.map(mapRecentlyViewedItem),
            "Recently viewed products fetched successfully"
        )
    );
});

const getWishlist = asyncHandler(async (req, res) => {
    const wishlist = await Wishlist.find({ user: req.user._id }).sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new APIresponse(200, wishlist.map(mapWishlistItem), "Wishlist fetched successfully"));
});

const toggleWishlist = asyncHandler(async (req, res) => {
    const snapshot = buildWishlistSnapshot(req.body?.product || req.body?.item || req.body);
    const existing = await Wishlist.findOne({ user: req.user._id, productKey: snapshot.productKey });

    if (existing) {
        await Wishlist.deleteOne({ _id: existing._id });
    } else {
        await Wishlist.create({
            user: req.user._id,
            ...snapshot,
        });
    }

    const wishlist = await Wishlist.find({ user: req.user._id }).sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new APIresponse(200, wishlist.map(mapWishlistItem), "Wishlist updated successfully"));
});

const removeWishlistItem = asyncHandler(async (req, res) => {
    const productKey = (req.params.productKey || req.params.productId || req.body?.productKey || req.body?.productId || "").toString().trim();

    if (!productKey) {
        throw new APIerror(400, "Product key is required");
    }

    await Wishlist.deleteOne({ user: req.user._id, productKey });

    const wishlist = await Wishlist.find({ user: req.user._id }).sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new APIresponse(200, wishlist.map(mapWishlistItem), "Wishlist item removed successfully"));
});

const deleteSearchHistoryItem = asyncHandler(async (req, res) => {
    const historyId = req.params.historyId;

    if (!historyId || !mongoose.Types.ObjectId.isValid(historyId)) {
        throw new APIerror(400, "Valid history id is required");
    }

    await SearchHistory.deleteOne({ _id: historyId, user: req.user._id });

    const history = await pruneAndLoadSearchHistory(req.user._id);

    return res.status(200).json(new APIresponse(200, history, "Search history item deleted successfully"));
});

const clearSearchHistory = asyncHandler(async (req, res) => {
    await SearchHistory.deleteMany({ user: req.user._id });
    return res.status(200).json(new APIresponse(200, [], "Search history cleared successfully"));
});

const getSearchHistory = asyncHandler(async (req, res) => {
    const history = await pruneAndLoadSearchHistory(req.user._id);

    return res.status(200).json(new APIresponse(200, history, "Search history fetched successfully"));
});


const updateUserAvatar = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new APIerror(400, "Image file is required.");
    }

    // Build a stable public_id so re-uploads overwrite the same Cloudinary asset
    // rather than creating a new one each time.
    const publicId = `avatars/user_${req.user._id}`;

    let cloudinaryResult;
    try {
        cloudinaryResult = await uploadToCloudinary(req.file.buffer, "pricewise/avatars", publicId);
    } catch {
        throw new APIerror(500, "Failed to upload image. Please try again.");
    }

    if (!cloudinaryResult?.secure_url) {
        throw new APIerror(500, "Image upload succeeded but no URL was returned.");
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: { avatar: cloudinaryResult.secure_url } },
        { new: true }
    ).select("-password -refreshToken");

    return res
        .status(200)
        .json(new APIresponse(200, user, "Profile picture updated successfully."));
});

const removeUserAvatar = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: { avatar: "" } },
        { new: true }
    ).select("-password -refreshToken");

    return res
        .status(200)
        .json(new APIresponse(200, user, "Profile picture removed successfully."));
});


// const updateUserAvatar = asyncHandler(async(req, res) => {
//     const avatarLocalPath = req.file?.path

//     if (!avatarLocalPath) {
//         throw new APIerror(400, "Avatar file is missing")
//     }

//     const avatar = await uploadOnCloudinary(avatarLocalPath)

//     if (!avatar.url) {
//         throw new APIerror(400, "Error while uploading on avatar")
        
//     }

//     const user = await User.findByIdAndUpdate(
//         req.user?._id,
//         {
//             $set:{
//                 avatar: avatar.url
//             }
//         },
//         {new: true}
//     ).select("-password")

//     return res
//     .status(200)
//     .json(
//         new APIresponse(200, user, "Avatar image updated successfully")
//     )
// }



export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    removeUserAvatar,
    getWishlist,
    toggleWishlist,
    removeWishlistItem,
    deleteSearchHistoryItem,
    clearSearchHistory,
    getSearchHistory,
    getRecentlyViewedProducts,
    syncRecentlyViewedProducts,
};
