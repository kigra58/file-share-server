import mongoose from "mongoose";
import { config } from "dotenv";

config();
const conn = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/fileSharing");
    console.log("database connection successfully");
  } catch (error) {
    console.error("databse connection error:", error);
  }
};

export default conn;
