import { User } from "../Models/user.models.js";
import { asyncHandler } from "../utils/asynchandler.js";

const getUserData = asyncHandler(async (req, res) => {
    const {userId} = req.body;
    const user = await User.findById(userId).select("-password");
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
            isAccountVerified: user.isAccountVerified,
        },
    });
})

export { getUserData };