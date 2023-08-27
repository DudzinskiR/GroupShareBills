import express, { Request, Response } from "express";
import bill from "./bill/bill-routes";
import user from "./user/user-routes";

const router = express.Router({ mergeParams: true });

router.use("/bill", bill);
router.use("/user", user);

export default router;
