import UserController from "@controllers/user/user.controller";
import endpoint from "@middleware/endpoint.middleware";
import express, { Request, Response } from "express";
const router = express.Router();

router.get("/", endpoint(UserController.getUserID));
router.get("/:userID", endpoint(UserController.getUsername));
router.put("/name", endpoint(UserController.changeUsername));

export default router;
