import mongoose from "mongoose";

const conn = async (url: string) => {
  try {
    if (url !== "") {
      await mongoose.connect(url);
      console.log("database connection successfully");
    } else {
      console.log("Inavalid DATABSE URL");
    }
  } catch (error) {
    console.error("databse connection error:", error);
  }
};

export default conn;
