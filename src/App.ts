import express from "express";
import cors from "cors";
import Path from "path";
import { config } from "dotenv";

import conn from "./connection/connection";
import router from "./routes/route";

config();
conn();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/", express.static("public"));

app.set("views", Path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(router);

app.get("/", (req, res) => {
  const filePath = Path.join(__dirname, "public/index.html");
  res.sendFile(filePath);
});

app.listen(process.env.PORT || 3020, () => {
  console.log("server is running at port 3020");
});
