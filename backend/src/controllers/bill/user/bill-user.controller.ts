import express, { Request, Response } from "express";
import BillUserService from "services/bill/user/bill-user.service";

class BillUserController {
  static async setUserAsAdmin(req: Request, res: Response) {
    const userID = req.params.userID;
    const billID = req.params.billID;

    const data = await BillUserService.setUserAsAdmin(userID, billID);
    res.status(200).send(data);
  }

  static async setUserActive(req: Request, res: Response) {
    const userID = req.params.userID;
    const billID = req.params.billID;
    const active: boolean = `${req.body.active}`.toLocaleLowerCase() === "true";

    const data = await BillUserService.setUserActive(userID, billID, active);
    res.status(200).send(data);
  }

  static async getUsers(req: Request, res: Response) {
    const billID = req.params.billID;
    const data = await BillUserService.getUsers(billID);
    res.status(200).send(data);
  }

  static async deleteUser(req: Request, res: Response) {
    const billID = req.params.billID;
    const userID = req.params.userID;

    const data = await BillUserService.deleteUser(billID, userID);
    res.status(200).send(data);
  }
}

export default BillUserController;
