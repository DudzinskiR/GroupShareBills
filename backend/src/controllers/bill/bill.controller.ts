import express, { Request, Response } from "express";
import BillService from "services/bill/bill.service";

class BillController {
  static async getBills(req: Request, res: Response) {
    const userID = req.user?.userID!;
    const data = await BillService.getBills(userID);
    res.status(200).send(data);
  }

  static async createNewBill(req: Request, res: Response) {
    const data = await BillService.createNewBill(
      req.user?.userID!,
      req.body.billName,
      req.body.currency
    );
    res.status(200).send(data);
  }

  static async editBillSetting(req: Request, res: Response) {
    const billID = req.params.billID;
    await BillService.editBill(billID, req.body.billName);
    res.status(200).send({ status: "ok" });
  }

  static async closeBill(req: Request, res: Response) {
    const billID = req.params.billID;

    const data = await BillService.closeBill(billID);
    res.status(200).send({ status: "ok" });
  }

  static async getCurrency(req: Request, res: Response) {
    const billID = req.params.billID;
    const data = await BillService.getCurrency(billID);
    res.status(200).send(data);
  }

  static async changeBillSetting(req: Request, res: Response) {
    const billID = req.params.billID;
    const billName = req.body.billName;
    const data = await BillService.changeBillSetting(billID, billName);
    res.status(200).send(data);
  }

  static async getBillBalance(req: Request, res: Response) {
    const billID = req.params.billID;
    const userID = req.user?.userID!;
    const data = await BillService.getBillBalance(billID, userID);
    res.status(200).send(data);
  }
}

export default BillController;
