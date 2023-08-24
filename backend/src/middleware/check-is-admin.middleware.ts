import BillNotFoundException from "@exceptions/bill-not-found.exception";
import NoPermissionException from "@exceptions/no-permissions.exception";
import { db } from "@utils/firebase/firebase-config";
import express, { Request, Response, NextFunction } from "express";

const checkIsAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userID = req.user?.userID!;
  const billID = req.params.billID;

  const billRef = await db.collection("bills").doc(billID).get();

  if (!billRef.data()) {
    const error = new BillNotFoundException();
    res.status(error.code).json({ status: "error", message: error.message });
    return;
  }

  if (billRef.data()?.adminID !== userID) {
    const error = new NoPermissionException();
    res.status(error.code).json({ status: "error", message: error.message });
    return;
  }

  next();
};

export default checkIsAdmin;
