import UserController from "@controllers/user.controller";
import checkUser from "@middleware/check-user.middleware";
import express, { Request, Response } from "express";
const router = express.Router();

router.use("/:userID", UserController.getUsername);
router.use("/", checkUser, UserController.getUserID);

export default router;
