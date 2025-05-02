import mongoose from "mongoose";

const connnectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}`
    );
    console.log(
      `Mongoodb connected with DB host , conguarlate ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("mongoodb connection Not connected check again", error);
    process.exit(1);
  }
};
export default connnectDB;