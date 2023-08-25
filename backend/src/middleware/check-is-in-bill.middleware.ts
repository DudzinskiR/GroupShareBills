import BillNotFoundException from "@exceptions/bill-not-found.exception";
import NoPermissionException from "@exceptions/no-permissions.exception";
import { db } from "@utils/firebase/firebase-config";
import express, { Request, Response, NextFunction } from "express";
import { Bill } from "interfaces/bill";

const checkIsInBill = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userID = req.user?.userID!;
  const billID = req.params.billID;

  const billRef = await db.collection("bills").doc(billID).get();
  const billData = billRef.data() as Bill;

  if (!billData) {
    const error = new BillNotFoundException();
    res.status(error.code).json({ status: "error", message: error.message });
    return;
  }

  const result = billData.users.some((user) => user.userID === userID);
  if (!result) {
    const error = new NoPermissionException();
    res.status(error.code).json({ status: "error", message: error.message });
    return;
  }

  next();
};

export default checkIsInBill;
