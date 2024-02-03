import { Router } from "express";
import { Auth } from "../middlerware/auth";
import { downloadFile, uploadFile } from "../controller/controller";
import multer from "multer";
const router = Router();

/**
 * UPLOAD FILE
 */

const upload = multer({ dest: "uploads" }).single("file");
router.post("/upload", upload, uploadFile);

/**
 *  DOWNLOAD FILE
 */
router.get("/file/:id", Auth, downloadFile);

export default router;
