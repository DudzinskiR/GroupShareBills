import BillController from "@controllers/bill.controller";
import checkIsAdmin from "@middleware/check-is-admin.middleware";
import endpoint from "@middleware/endpoint.middleware";
import express, { Request, Response } from "express";
const router = express.Router();

router.post("/", endpoint(BillController.createNewBill));
router.put("/:billID", checkIsAdmin, endpoint(BillController.editBillSetting));
router.delete("/:billID", checkIsAdmin, endpoint(BillController.closeBill));

router.put(
  "/:billID/user/:userID/admin",
  checkIsAdmin,
  endpoint(BillController.setUserAsAdmin)
);

router.put(
  "/:billID/user/:userID",
  checkIsAdmin,
  endpoint(BillController.setUserActive)
);

export default router;
