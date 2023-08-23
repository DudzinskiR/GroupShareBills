import { db } from "@utils/firebase/firebase-config";
import express, { Request, Response, NextFunction } from "express";

const checkUser = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.decodedToken.uid);
  const e = await db
    .collection("users")
    .where("userID", "==", req.decodedToken.uid)
    .get();
  console.log(e);
  next();
};

export default checkUser;
