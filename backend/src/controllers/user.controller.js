import { asyncHandler } from '../utils/asyncHandler.js';
import { APIerror } from '../utils/APIerror.js';
import { User } from '../models/user.model.js';
import { SearchHistory } from '../models/searchHistory.model.js';
import { Wishlist } from '../models/wishlist.model.js';
// import {uploadOnCloudinary} from "../utils/cloudinary.js"
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



const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary 
    // check avatar again
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res
    
    

    const { fullname, email, password } = req.body;
    // console.log("email", email);



    if (
        [fullname, email, password].some((field) => field?.trim() === "")
    ) {
        throw new APIerror(400, "All fields are required")
    }



    const existedUser = await User.findOne({
        email,
    })
    if (existedUser) {
        throw new APIerror(409, "User with email or username already exists")
    }
    


    // const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    // let coverImageLocalPath;
    // if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    //     coverImageLocalPath = req.files.coverImage[0].path
    // }

    // if (!avatarLocalPath) {
    //     throw new APIerror(400, "Avatar file is required")
    // }



    // const avatar = await uploadOnCloudinary(avatarLocalPath)
    // const coverImage = await uploadOnCloudinary(coverImageLocalPath)



    // if (!avatar) {
    //     throw new APIerror(400, "Avatar file is required")
    // }



    const user = await User.create({
        fullname,
        // avatar: avatar.url,
        // coverImage: coverImage?.url || "",
        email, 
        password,
    })



    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )



    if (!createdUser) {
        throw new APIerror(500, "Something went wrong while registering the user")
    }



    return res.status(201).json(
        new APIresponse(200, createdUser, "User registered Successfully")
    )
});



const loginUser = asyncHandler(async (req, res) => {
    // req body -> data
    // username or email
    // find the user
    // password check
    // access and referesh token
    // send cookie



    const { email, password } = req.body
    console.log(email);



    if (!email || !password) {
        throw new APIerror(400, "email and password are required")
    }
    
    // an alternative of above code:
    // if (!(username || email)) {
    //     throw new APIerror(400, "username or email is required")   
    // }



    const user = await User.findOne({
        email
    })

    if (!user) {
        throw new APIerror(404, "User does not exist")
    }



    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new APIerror(401, "Invalid user credentials")
    }



    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")



    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new APIresponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged In Successfully"
            )
        )
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
    const {fullname, email} = req.body

    if (!fullname || !email) {
        throw new APIerror(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullname,
                email: email
            }
        },
        {new: true}
        
    ).select("-password")

    return res
    .status(200)
    .json(new APIresponse(200, user, "Account details updated successfully"))
});

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
    const productKey = normalizeWishlistKey(req.params.productKey || req.params.productId || req.body?.productKey || req.body?.productId);

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

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const history = await SearchHistory.find({
        user: req.user._id,
        createdAt: { $gte: threeMonthsAgo },
    })
        .sort({ searchedAt: -1, createdAt: -1 });

    return res.status(200).json(new APIresponse(200, history, "Search history item deleted successfully"));
});

const clearSearchHistory = asyncHandler(async (req, res) => {
    await SearchHistory.deleteMany({ user: req.user._id });
    return res.status(200).json(new APIresponse(200, [], "Search history cleared successfully"));
});

const getSearchHistory = asyncHandler(async (req, res) => {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const history = await SearchHistory.find({
        user: req.user._id,
        createdAt: { $gte: threeMonthsAgo },
    })
        .sort({ searchedAt: -1, createdAt: -1 });

    const dedupedHistory = history.reduce((acc, item) => {
        const lastItem = acc[acc.length - 1];
        const currentTime = new Date(item.searchedAt || item.createdAt).getTime();
        const currentNormalizedQuery = (item.normalizedQuery || item.query || "").toLowerCase().trim();

        if (lastItem) {
            const lastTime = new Date(lastItem.searchedAt || lastItem.createdAt).getTime();
            const lastNormalizedQuery = (lastItem.normalizedQuery || lastItem.query || "").toLowerCase().trim();
            const isSameQuery = currentNormalizedQuery && lastNormalizedQuery && currentNormalizedQuery === lastNormalizedQuery;
            const isRecentDuplicate = isSameQuery && currentTime - lastTime <= 60 * 1000;

            if (isRecentDuplicate) {
                return acc;
            }
        }

        acc.push(item);
        return acc;
    }, []);

    return res.status(200).json(new APIresponse(200, dedupedHistory, "Search history fetched successfully"));
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
    getWishlist,
    toggleWishlist,
    removeWishlistItem,
    deleteSearchHistoryItem,
    clearSearchHistory,
    getSearchHistory,
    // updateUserAvatar,
};
