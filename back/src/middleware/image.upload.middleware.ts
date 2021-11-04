import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { extname } from "path-posix";

export class ImageUpload {

  imageFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/))
      return callback(new Error('Only image files are allowed!'), false);
    callback(null, true);
  };

  editFileName = (req, file, callback) => {
    const id = req.cookies['user_id']

    callback(null, `${id}${extname(file.originalname)}`);
  }

}