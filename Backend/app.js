import express from "express";
import cors from "cors";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/test", (req, res) => {
    // res.send("Server is running");
    res.json({message: "Backend Connected Successfully"})
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export {app}