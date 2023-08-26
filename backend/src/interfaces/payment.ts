import { Timestamp } from "./Timestamp";

export interface Payment {
  description: string;
  value: number;
  creatorID: string;
  usersID: string[];
  time: Timestamp;
  isDelete: boolean;
}

export interface PaymentHistory {
  time: number;
  payments: PaymentResponse[];
}

export interface PaymentResponse {
  description: string;
  value: number;
  creatorID: string;
  usersID: string[];
  time: number;
  id: string;
}
