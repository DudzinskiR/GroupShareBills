import { db } from "@utils/firebase/firebase-config";
import express, { Request, Response, NextFunction } from "express";
import User from "interfaces/user";

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userDocs = await db
      .collection("users")
      .where("authID", "==", req.decodedToken.uid)
      .get();

    if (!userDocs.empty) {
      const userData = userDocs.docs[0].data();

      req.user = {
        userID: userDocs.docs[0].id,
        username: userData?.username,
        authID: userData?.authID,
        billsID: userData?.billsID,
      };
    } else {
      req.user = await createUser(req.decodedToken.uid);
    }
  } catch (e) {
    res.status(500).json({ status: "error", message: "Unknown error" });
  }

  next();
};

const createUser = async (authID: string): Promise<User> => {
  const newUser: User = {
    authID: authID,
    username: `user-${authID.slice(0, 5)}`,
    billsID: [],
    userID: "",
  };

  try {
    const response = await db.collection("users").add(newUser);
    newUser.userID = response.id;
  } catch (e) {
    throw e;
  }

  return newUser;
};

export default getUser;
