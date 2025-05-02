import { User } from "../Models/user.models.js";

const registerUser = async (req, res) => {
    const {firstName, lastName, email, password} = req.body;
    if (!(firstName && lastName && email && password)) {
        res.status(400).send("All fields are required");
        
    }

    console.log(req.body);

    const user = await User.create({
        firstName,
        lastName,
        email,
        password
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering the user");
    }
  
    return res.status(201).json(createdUser, "User registered successfully");

}

export {registerUser};