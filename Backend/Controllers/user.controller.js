import jwt from 'jsonwebtoken'
import { User } from "../Models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from '../utils/ApiResponse.js';

const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        console.log("user", user);
        
        const accessToken = user.generateAccessToken();
        console.log("Access Token generated:", accessToken);

        const refreshToken = user.generateRefreshToken();
        console.log("Refresh Token generated:", refreshToken);


        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");

    }
}

const registerUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    console.log(req.body);

    if (!(firstName && lastName && email && password)) {
       return res.status(400).send("All fields are required2");

    }

    const existedUser = await User.findOne({ email });
    if (existedUser) {
        return res.json({ success: false, message: "email already exists" })
    }


    // console.log(req.body);

    const user = await User.create({
        firstName,
        lastName,
        email,
        password
    });


    const createdUser = await User.findById(user._id).select("-password");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: createdUser
    });
    
}

const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ApiError(400, "All fields are requiredd"));
    }

    const user = await User.findOne({ email });
    if (!user) {
        return next(new ApiError(400, "User does not exists"));
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        return next(new ApiError(401, "Invalid user credentials"));
    };

    const  {accessToken, refreshToken}  = await generateAccessTokenAndRefreshToken(user._id);
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
    }

    return res
    .status(200)   
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, {
        user: user.toObject({ getters: true }),
        accessToken,  
        refreshToken,
      }, "User logged in successfully")
    );

}

const logoutUser = asyncHandler(async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(200)
          .clearCookie("accessToken")
          .clearCookie("refreshToken")
          .json(new ApiResponse(200, {}, "User logged out successfully"));
      }
  
      await User.findByIdAndUpdate(
        req.user._id,
        {
          $unset: {
            refreshToken: 1
          }
        },
        {
          new: true,
  
        }
      );
  
      return res.status(200)
        .clearCookie("accessToken", { httpOnly: true, secure: true, sameSite: "Strict" })
        .clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "Strict" })
        .json(new ApiResponse(200, {}, "User logged out successfully"));
  
    } catch (error) {
      next(error);
    }
  });
  

const refershAccessToken = asyncHandler(async (req, res) => {
    const incomingRefereshToken = req.cookies.refreshToken || req.body.refreshToken
    if (!incomingRefereshToken) {
        throw new ApiError(400, "Invalid Creditentials");

    }

    try {
        const decodeToken = jwt.verify(
            incomingRefereshToken,
            // process.env.ACCESS_TOKEN_SECRET,
            process.env.REFRESH_TOKEN_SECRET,

        )
        const user = await User.findById(decodeToken?._id);
        if (!user) {
            throw new ApiError(401, "Invalid refersh Token");
        }

        if (incomingRefereshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        };

        const options = {
            httpOnly: true,
            secure: false,
        }

        const { accessToken, newRefreshToken } = await generateAccessTokenAndRefreshToken(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access Token Refreshed"
                )
            )



    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Refresh Token")

    }
})

export { registerUser, loginUser, refershAccessToken,logoutUser };