import BillController from "@controllers/bill/bill.controller";
import checkIsAdmin from "@middleware/check-is-admin.middleware";
import endpoint from "@middleware/endpoint.middleware";
import express, { Request, Response } from "express";
import billUserRoutes from "./user/bill-user-routes";
import billPaymentRoutes from "./payment/bill-payment-routes";
import checkIsInBill from "@middleware/check-is-in-bill.middleware";

const router = express.Router();

router.post("/", endpoint(BillController.createNewBill));
router.get("/", endpoint(BillController.getBills));
router.put("/:billID", checkIsAdmin, endpoint(BillController.editBillSetting));
router.delete("/:billID", checkIsAdmin, endpoint(BillController.closeBill));
router.get(
  "/:billID/currency",
  checkIsInBill,
  endpoint(BillController.getCurrency)
);

router.use("/:billID/user", billUserRoutes);
router.use("/:billID/payment", billPaymentRoutes);

export default router;
