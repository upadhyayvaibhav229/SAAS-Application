import { User } from "../Models/user.models.js";
import { asyncHandler } from "../utils/asynchandler.js";

// const getUserData = asyncHandler(async (req, res) => {
//     const {userId} = req.body;
//     const user = await User.findById(userId).select("-password");
//     if (!user) {
//         return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json({ 
//         success: true,
//         user: {
//             id: user._id,
//             email: user.email,
//             firstName: user.firstName,
//             lastName: user.lastName,

//             isAccountVerified: user.isAccountVerified,
//         },
//     });
// })


const getUserData = asyncHandler(async (req, res) => {
  // Use id from the verified JWT user
  const userId = req.user.id;

  const user = await User.findById(userId).select("-password -refreshToken");
  
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone || "",
      location: user.location || "",
      role: user.role || "",
      isAccountVerified: user.isAccountVerified,
    },
  });
});


const updateUser = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const { firstName, lastName, email, phone, location, role } = req.body;

  const user = await User.findByIdAndUpdate(
    userId,
    {
      firstName,
      lastName,
      email,
      phone,
      location,
      role,
    },
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({
    success: true,
    message: "User profile updated successfully",
    user,
  });
});



export { getUserData, updateUser };