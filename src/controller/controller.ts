import { Request, Response } from "express";
import { FileModel } from "../model/file";
import bcrypt from "bcryptjs";
import { config } from "dotenv";

config();

/**
 * UPLOAD FILE
 * @param req
 * @param res
 */
export const uploadFile = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    if (password !== "" && req.file) {
      const insertData = await FileModel.create({
        path: req.file?.path,
        fileName: req.file?.originalname,
        password: await bcrypt.hash(password, 10),
      });
      if (insertData) {
        const fileLink = `${process.env.API_URL}${insertData.id}`;
        res.status(200).json({ success: true, data: fileLink });
      } else {
        res
          .status(500)
          .json({ success: false, error: "Unable to Upload file" });
      }
    }
  } catch (error) {
    console.error(error);
  }
};

/**
 * DOWNLOAD FILE
 * @param req
 * @param res
 */
export const downloadFile = async (req: Request, res: Response) => {
  try {
    if (req.params.id) {
      const existFile = await FileModel.findById(req.params.id);
      if (existFile) {
        existFile.downloadCount++;
        await existFile.save();
        res.download(existFile.path, existFile.fileName);
      } else {
        res.status(400).json({ success: false, message: "File Not Exist" });
      }
    }
  } catch (error) {
    console.error(error);
  }
};
