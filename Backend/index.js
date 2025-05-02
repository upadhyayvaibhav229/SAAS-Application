import dotenv from "dotenv";
import connnectDB from "./config/db.js";
import { app } from "./app.js";

dotenv.config();

connnectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
    app.on("error", (error) => console.log(error));
  })
  .catch((error) => console.log("Database connection failed", error));
