import BillUserController from "@controllers/bill/user/bill-user.controller";
import checkIsAdmin from "@middleware/check-is-admin.middleware";
import checkIsInBill from "@middleware/check-is-in-bill.middleware";
import endpoint from "@middleware/endpoint.middleware";
import express, { Request, Response } from "express";
const router = express.Router({ mergeParams: true });

router.put(
  "/:userID/admin",
  checkIsAdmin,
  endpoint(BillUserController.setUserAsAdmin)
);

router.put(
  "/:userID",
  checkIsAdmin,
  endpoint(BillUserController.setUserActive)
);

router.get("/", checkIsInBill, endpoint(BillUserController.getUsers));

router.delete(
  "/:userID",
  checkIsAdmin,
  endpoint(BillUserController.deleteUser)
);

router.delete("/", checkIsInBill, endpoint(BillUserController.deleteMe));

export default router;
