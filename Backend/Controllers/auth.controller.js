import jwt from "jsonwebtoken";
import { User } from "../Models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import transporter from "../config/nodemailer.js";
import nodemailer from "nodemailer";
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from "../config/emailTemplates.js";
import { Tenant } from "../Models/tenant.models.js";

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
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

import slugify from "slugify";
import { ROLE_PERMISSIONS } from "../config/role.js";

const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, companyName } = req.body;

  if (!(firstName && lastName && email && password && companyName)) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "Email already exists",
    });
  }

  const slug = slugify(companyName, { lower: true, strict: true });
  const tenant = await Tenant.create({ name: companyName, slug });

  // Create first User as admin
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role: "admin",
    tenantId: tenant._id,
  });

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  };

  try {
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to our platform!",
      text: `Welcome ${firstName} ${lastName}, you have successfully registered as admin of ${companyName}.`,
    });
  } catch (err) {
    console.error("Email sending error:", err.message);
  }

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        201,
        {
          user: {
            id: user._id,
            email: user.email,
            fullName: `${user.firstName} ${user.lastName}`,
            role: user.role,
            permissions: ROLE_PERMISSIONS[user.role],  // ✅ Add this line

            tenantId: user.tenantId,
          },
          tenant: {
            id: tenant._id,
            name: tenant.name,
            slug: tenant.slug, // ✅ include slug
          },
          accessToken,
          refreshToken,
        },
        "Tenant and admin user created successfully"
      )
    );
};


const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ApiError(400, "All fields are required"));
  }

  const user = await User.findOne({ email }).populate("tenantId", "name slug");
  if (!user) {
    return next(new ApiError(400, "User does not exist"));
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    return next(new ApiError(401, "Invalid user credentials"));
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: {
            id: user._id,
            email: user.email,
            fullName: `${user.firstName} ${user.lastName}`,
            role: user.role,
            // permissions: ROLE_PERMISSIONS[user.role],

            tenant: {
              id: user.tenantId._id,
              name: user.tenantId.name,   // ✅ Company name
              slug: user.tenantId.slug,   // ✅ Slug
            },
          },
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
};

const logoutUser = asyncHandler(async (req, res, next) => {
  try {
    if (!req.user) {
      return res
        .status(200)
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .json(new ApiResponse(200, {}, "User logged out successfully"));
    }

    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      {
        new: true,
      }
    );

    return res
      .status(200)
      .clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
      })
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
      })
      .json(new ApiResponse(200, {}, "User logged out successfully"));
  } catch (error) {
    next(error);
  }
});

const refershAccessToken = asyncHandler(async (req, res) => {
  const incomingRefereshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefereshToken) {
    throw new ApiError(400, "Invalid Creditentials");
  }

  try {
    const decodeToken = jwt.verify(
      incomingRefereshToken,
      // process.env.ACCESS_TOKEN_SECRET,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodeToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid refersh Token");
    }

    if (incomingRefereshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: false,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessTokenAndRefreshToken(user._id);

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
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Refresh Token");
  }
});

const SendverifyOtp = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;
  const user = await User.findById(userId);

  if (!user) {
    return res.status(400).json({
      message: "User not found",
    });
  }

  if (user.isAccountVerified) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Account already verified"));
  }

  // Generate OTP
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  user.verifyOtp = otp;
  user.verifyOtpExpiredAt = Date.now() + 15 * 60 * 1000; // OTP expires in 15 minutes

  await user.save();

  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: user.email,
    subject: "🔐 Verify Your Account - OTP Verification",
    html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email),

  };

  // console.log(mailOptions);

  try {
    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("Error sending email:", error);
    return res.status(500).json({
      message: "Error sending OTP email. Please try again later.",
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { otp }, "OTP sent successfully"));
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { userId, otp } = req.body;
  console.log(userId, otp);

  if (!userId || !otp) {
    return res.status(400).json({
      message: "User details are required",
    });
  }

  // Fetch user from the database
  const user = await User.findById(userId);

  // Check if user is found
  if (!user) {
    return res.status(400).json({
      message: "User not found",
    });
  }

  // Check if OTP is expired
  if (Date.now() > user.verifyOtpExpiredAt) {
    return res.status(400).json({
      message: "OTP expired",
    });
  }

  // Check if OTP matches
  if (user.verifyOtp !== otp) {
    return res.status(400).json({
      message: "Invalid OTP",
    });
  }

  // Update user verification status
  user.isAccountVerified = true;
  user.verifyOtp = null;
  user.verifyOtpExpiredAt = null;

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Email verified successfully"));
});


const isAuthenticated = asyncHandler(async (req, res) => {
  try {
    const token = req.cookies?.accessToken;
    console.log(token);
    

    if (!token) {
      throw new ApiError(401, "Not authenticated");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded?._id);

    if (!user) {
      throw new ApiError(401, "Invalid token");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, { userId: user._id }, "Authenticated"));
  } catch (error) {
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "Not authenticated"));
  }
});

// generate otp for reset password
const sendResetPasswordOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      message: "Email is required",
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      message: "User not found",
    });
  }

  const otp = String(Math.floor(100000 + Math.random() * 900000));
  user.resetOtp = otp;
  user.resetOtpExpiredAt = Date.now() + 15 * 60 * 1000; // OTP expires in 15 minutes

  await user.save();

  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: "🔐 Reset Your Password - OTP Verification",
    html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "OTP sent successfully"));
  } catch (error) {
    return res.status(500).json({
      message: "Error sending OTP email. Please try again later.",
    });
  }
});

// reset password
const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      message: "User not found",
    });
  }

  if (
    user.resetOtp !== otp ||
    user.resetOtp === "" ||
    user.resetOtpExpiredAt < Date.now()
  ) {
    return res.status(400).json({
      message: "Invalid OTP or OTP has expired",
    });
  }

  // const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = newPassword;
  user.resetOtp = "";
  user.resetOtpExpiredAt = 0;

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successfully"));
});

export {
  registerUser,
  loginUser,
  refershAccessToken,
  logoutUser,
  verifyEmail,
  SendverifyOtp,
  isAuthenticated,
  sendResetPasswordOtp,
  resetPassword,
};
