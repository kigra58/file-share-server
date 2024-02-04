import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { FileModel } from "../model/file";

const REDIRECT_URL = "http://localhost:3009/download/";

export const Auth = async (req: Request, res: Response, next: NextFunction) => {
  if (req.params && req.params.id) {
    const existFile = await FileModel.findById(req.params.id);
    if (existFile) {
      if (existFile && existFile.verified) {
        next();
      } else {
        res.redirect(REDIRECT_URL.concat(req.params.id));
      }
    } else {
      res.status(200).json({
        success: false,
        message: "File Not Exist ",
        url: REDIRECT_URL.concat(req.params.id),
      });
    }
  } else {
    res.redirect(REDIRECT_URL.concat(req.params.id));
  }
};
