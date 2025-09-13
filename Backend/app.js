import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const PORT = process.env.PORT || 5000;
app.use(cors({
    origin: "http://localhost:5173",  // replace with your frontend URL
    credentials: true,  // Allow cookies (if you're using them)
}));            

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./router/user.route.js";

app.use('/api/v1/users', userRouter);


export { app }