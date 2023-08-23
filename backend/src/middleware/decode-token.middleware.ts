import { firebaseAuth } from "@utils/firebase/firebase-config";
import express, { Request, Response, NextFunction } from "express";

const decodeToken = async (req: Request, res: Response, next: NextFunction) => {
  const tokenID = `${req.headers.authorization}`.split(" ")[1];

  if (!tokenID) {
    return res
      .status(401)
      .json({ status: "error", message: "Missing authentication token" });
  }

  try {
    const decodedToken = await firebaseAuth.verifyIdToken(tokenID);
    req.decodedToken = decodedToken;
    next();
  } catch (e) {
    return res
      .status(403)
      .json({ status: "error", message: "Unauthorized access" });
  }
};

export default decodeToken;
