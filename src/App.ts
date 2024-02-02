import express from "express";
import multer from "multer";
import cors from "cors";
import Path from "path";
import { config } from "dotenv";
import { FileModel } from "./model/file";
import bcrypt from "bcryptjs";
import conn from "./connection/connection";

config();
conn();
const app = express();
app.use(cors());
app.use(express.json());
app.set("views", Path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use("/", express.static("public"));
const upload = multer({ dest: "uploads" })

// const filePath=Path.join(__dirname,"public/index.html")

app.get("/", (req, res) => {
   const filePath = Path.join(__dirname, "public/index.html");
  res.sendFile(filePath);
});

app.post("/upload", upload.single("file"), async (req, res) => {
  const { password } = req.body;
  if (password !== "" && req.file) {
    const hashPassword = await bcrypt.hash(password, 10);
    const fileData = {
      path: req.file?.path,
      fileName: req.file?.originalname,
      password:hashPassword,
    };
    console.log("fileData",fileData);
    const insertData = await FileModel.create(fileData);
    if (insertData) {
      const fileLink = `http://localhost:3020/file/${insertData.id}`;
      res.status(200).json({ success: true, data:fileLink });

    } else {
      res.status(200).json({ success: false, error: "Unable to insert data" });
    }
  }
});

app.post("/file/:id", async (req, res) => {
  try {
    if (req.params.id && req.body.password) {
      const existFile = await FileModel.findById(req.params.id);
      if (existFile) {
        console.log("====existFile=password",existFile.password);
        const hashPassword = await bcrypt.hash(req.body.password, 10);
        console.log("======hashPass",hashPassword)
        const comparePass= await bcrypt.compare(hashPassword,existFile.password);
        console.log("=====isVerify",comparePass)
        if(comparePass){
          res.status(200).json({ success:true ,message: "verification successfully" ,data:existFile._id });
        }
        else {res.status(400).json({success:false,  message: "Credential not match" })}
      } else {
        res.status(400).json({ success:false, message: "file not found" });
      }
    }
  } catch (error) {
    console.error(error);
  }
});

app.get("/download/:id",async(req,res)=>{
  try {
    if(req.params  && req.params.id){
      const existFile = await FileModel.findById(req.params.id);
      if(existFile){
        existFile.downloadCount++;
        await existFile.save();
        res.download(existFile.path, existFile.fileName);
      }else{
        res.status(400).json({success:false, error: "file not found" });
      }
    }
  } catch (error) {
    console.error(error)
  }
})

app.listen(process.env.PORT || 3020, () => {
  console.log("server is running at port 3020");
});
