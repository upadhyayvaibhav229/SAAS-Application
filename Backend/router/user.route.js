import { Router } from "express";
import { loginUser, registerUser } from "../Controllers/user.controller.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login",loginUser);
router.post("/test", (req, res) => {
    console.log("Headers:", req.headers["content-type"]);
    console.log("Body:", req.body);
    res.send("Check server console for output");
  });
  

export default router;