/** @format */

import { NextFunction, Request, Response } from "express";
import jwt, {Jwt} from "jsonwebtoken";
import "dotenv/config";

const verify = (req, res, next: NextFunction) => {
  const authHeader = req.headers.token;
  if (typeof authHeader === "string") {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY as string, (err, user) => {
      if (err) res.status(403).json("Token is not valid!");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};

export default verify;
