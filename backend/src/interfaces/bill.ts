import { Payment } from "./payment";

export interface Bill {
  billName: string;
  currency: string;
  payment: Payment[];
  users: UserInBill[];
  adminID: string;
  isDelete: boolean;
}

interface UserInBill {
  userID: string;
  isActive: boolean;
}
