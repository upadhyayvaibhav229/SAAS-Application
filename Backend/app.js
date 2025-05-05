import express from "express";
import cors from "cors";

const app = express();

const PORT = process.env.PORT || 5000;
app.use(cors({
    origin: "http://localhost:5173",  // replace with your frontend URL
    credentials: true,  // Allow cookies (if you're using them)
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for form data

// app.get("/api/test", (req, res) => {
//     // res.send("Server is running");
//     res.json({message: "Backend Connected Successfully"})
// });

// routing
import userRouter from "./router/user.route.js";

app.use('/api/users', userRouter);


export { app }