import UserNotFoundException from "@exceptions/user-not-found.exception";
import express, { Request, Response } from "express";
import UserService from "services/user/user.service";

class UserController {
  static async getUserID(req: Request, res: Response) {
    res.status(200).send(req.user?.userID);
  }

  static async getUsername(req: Request, res: Response) {
    const username = await UserService.getUsername(req.params.userID);
    res.status(200).send(username);
  }

  static async changeUsername(req: Request, res: Response) {
    if (req.user?.userID) {
      await UserService.changeUsername(req.user?.userID, req.body.username);
    } else {
      throw new UserNotFoundException();
    }

    res.status(200).send({ status: "ok" });
  }
}

export default UserController;
