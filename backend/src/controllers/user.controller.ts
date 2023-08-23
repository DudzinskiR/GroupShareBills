import express, { Request, Response } from "express";
import UserService from "services/user.service";

class UserController {
  static async getUserID(req: Request, res: Response) {
    res.status(200).send(req.decodedToken.uid);
    return;
  }

  static async getUsername(req: Request, res: Response) {
    const username = await UserService.getUsername(req.params.userID);

    res.status(200).send(username);
  }
}

export default UserController;
