import { Router } from "express";
import { Auth } from "../middlerware/auth";
import { downloadFile, uploadFile, verify } from "../controller/controller";
import multer from "multer";
const router = Router();

/**
 * UPLOAD FILE
 */

const upload = multer({ dest: "uploads" }).single("file");
router.post("/upload", upload, uploadFile);

/**
 * VERFIED FILE
 */
router.post("/verify/file/:id", verify);

/**
 *  DOWNLOAD FILE
 */
router.get("/file/:id", Auth, downloadFile);

export default router;
