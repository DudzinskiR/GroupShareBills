import InvalidValueException from "@exceptions/invalid-value.exception";
import express, { Request, Response } from "express";
import BillPaymentService from "services/bill/payment/bill-payment.service";

class BillPaymentController {
  static async createPayment(req: Request, res: Response) {
    const billID = req.params.billID;
    const userID = req.user?.userID!;
    const description = req.body.description;
    const amount = req.body.amount;
    const usersID = req.body.usersID;

    if (typeof amount !== "number") {
      throw new InvalidValueException();
    }

    if (amount <= 0) {
      throw new InvalidValueException();
    }

    if (!(usersID instanceof Array)) {
      throw new InvalidValueException();
    }

    const data = await BillPaymentService.createPayment(
      billID,
      userID,
      description,
      amount,
      usersID
    );
    res.status(200).send({ status: "ok" });
  }

  static async getPayments(req: Request, res: Response) {
    const billID = req.params.billID;
    const payments = await BillPaymentService.getPayments(billID);
    res.status(200).send(payments);
  }
}

export default BillPaymentController;
