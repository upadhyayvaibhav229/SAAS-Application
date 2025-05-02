import express from "express";
import cors from "cors";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.get("/api/test", (req, res) => {
//     // res.send("Server is running");
//     res.json({message: "Backend Connected Successfully"})
// });

// routing
import userRouter from "./router/user.route.js";

app.use('/api/users', userRouter);


export {app}