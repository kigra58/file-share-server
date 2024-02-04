import { Request, Response } from "express";
import { FileModel } from "../model/file";
import { config } from "dotenv";
import bcrypt, { genSalt } from "bcryptjs";

config();

/**
 * UPLOAD FILE
 * @param req
 * @param res
 */
export const uploadFile = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    if (req.file) {
      if (req.body && req.body.password) {
        const insertData = await FileModel.create({
          path: req.file?.path,
          fileName: req.file?.originalname,
          // password: await bcrypt.hash(password, 10),
          password: bcrypt.hashSync(password, await genSalt(10)),
        });
        if (insertData) {
          const fileLink = `http://localhost:3020/file/${insertData.id}`;
          res.status(201).json({
            success: true,
            data: { fileLink, fileId: insertData._id },
          });
        } else {
          res
            .status(200)
            .json({ success: false, message: "Unable to Upload file" });
        }
      } else {
        res.status(200).json({
          success: false,
          message: "Please Enter Paasword for Encrypt your file",
        });
      }
    } else {
      res
        .status(200)
        .json({ success: false, message: "Select your file for Upload" });
    }
  } catch (error) {
    console.error(error);
  }
};

export const verify = async (req: Request, res: Response) => {
  try {
    if (req.params && req.params.id) {
      if (req.body && req.body.password) {
        const existFile = await FileModel.findById(req.params.id);
        if (existFile) {
          const hashPass = bcrypt.hashSync(
            req.body.password,
            await genSalt(10)
          );
          const comparePass = bcrypt.compareSync(req.body.password, hashPass);
          if (comparePass) {
            existFile.verified = true;
            await existFile.save();
            res.status(200).json({
              success: true,
              message: "Access garanted",
              data: existFile.verified,
            });
          } else {
            res.status(200).json({ success: false, message: "Access denied" });
          }
        } else {
          res.status(200).json({ success: false, message: "File Not Exit" });
        }
      } else {
        res.status(200).json({ success: false, message: "Access denied" });
      }
    } else {
      res.status(200).json({ success: false, message: "Acess deined" });
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
