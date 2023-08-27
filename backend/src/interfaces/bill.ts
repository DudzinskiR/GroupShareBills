import { Payment } from "./payment";

export interface Bill {
  billName: string;
  currency: string;
  payment: Payment[];
  users: UserInBill[];
  adminID: string;
  isDelete: boolean;
  request: string[];
}

export interface UserInBill {
  userID: string;
  isActive: boolean;
}
