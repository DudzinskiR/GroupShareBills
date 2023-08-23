import express, { Request, Response } from "express";
import bill from "./bill-routes";
import user from "./user-routes";

const router = express.Router();

router.use("/bill", bill);
router.use("/user", user);

export default router;
