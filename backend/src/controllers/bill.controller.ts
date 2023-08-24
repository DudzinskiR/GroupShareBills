import express, { Request, Response } from "express";
import BillService from "services/bill.service";

class BillController {
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

  static async setUserAsAdmin(req: Request, res: Response) {
    const userID = req.params.userID;
    const billID = req.params.billID;

    const data = await BillService.setUserAsAdmin(userID, billID);
    res.status(200).send(data);
  }

  static async setUserActive(req: Request, res: Response) {
    const userID = req.user?.userID!;
    const billID = req.params.billID;
    const active: boolean = `${req.body.active}`.toLocaleLowerCase() === "true";

    const data = await BillService.setUserActive(userID, billID, active);
    res.status(200).send(data);
  }
}

export default BillController;
