import { User } from "../Models/user.models.js";
import { ApiError } from "../utils/ApiError.js";



const registerUser = async (req, res) => {
    const {firstName, lastName, email, password} = req.body;
    console.log(req.body);
    
    if (!(firstName && lastName && email && password)) {
        res.status(400).send("All fields are required");
        
    }

    const existedUser = await User.findOne({email});
    if (existedUser) {
        return res.json({success: false, message: "email already exists"})
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
  
    return res.status(201).json(createdUser, "User registered successfully");

}

const loginUser = async (req, res, next) => {
    const {email, password} = req.body;
    if (!email && !password) {
        return next(new ApiError(400,"All fields are requiredd"));
    }

    const user = await User.findOne({email});
    if (!user) {
        return next(new ApiError(400, "User does not exists"));
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        return next(new ApiError(401, "Invalid user credentials"));
    };

}

export {registerUser, loginUser};