import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
    path: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    downloadCount: {
      type: Number,
      required: true,
      default:0
    },
  },
  {timestamps:true}
  );
  
export const FileModel = mongoose.model("File", FileSchema);