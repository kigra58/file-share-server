import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { FileModel } from "../model/file";

export const Auth = async (req: Request, res: Response, next: NextFunction) => {
  if (req.body && req.body.password !== "" && req.params && req.params.id) {
    const existFile = await FileModel.findById(req.params.id);
    if (existFile) {
      const hashPassword = await bcrypt.hash(req.body.password, 10);
      const comparePass = await bcrypt.compare(
        hashPassword,
        existFile.password
      );
      console.log("comparePass======>", comparePass);
      if (comparePass) {
        next();
      } else {
        res
          .status(400)
          .json({ success: false, message: "Credential Not Match" });
      }
    } else {
      res.status(400).json({ success: false, message: "File Not Exist " });
    }
  } else {
    res.status(500).json({ success: false, message: "Invalid File id" });
  }
};
