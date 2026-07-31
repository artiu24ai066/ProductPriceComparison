import { asyncHandler } from '../utils/asyncHandler.js';
import { APIerror } from '../utils/APIerror.js';
import { User } from '../models/user.model.js';
import { SearchHistory } from '../models/searchHistory.model.js';
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
    getSearchHistory,
    // updateUserAvatar,
};
