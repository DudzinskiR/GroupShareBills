import BillPaymentController from "@controllers/bill/payment/bill-payment.controller";
import checkIsInBill from "@middleware/check-is-in-bill.middleware";
import endpoint from "@middleware/endpoint.middleware";
import express, { Request, Response } from "express";

const router = express.Router({ mergeParams: true });

router.get("/", checkIsInBill, endpoint(BillPaymentController.getPayments));
router.post("/", checkIsInBill, endpoint(BillPaymentController.createPayment));

export default router;
