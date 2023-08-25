import { Timestamp } from "./Timestamp";

export interface Payment {
  description: string;
  value: number;
  date: Date;
  creatorID: string;
  usersID: string[];
  time: Timestamp;
}

export interface PaymentHistory {
  time: Date;
  payments: PaymentResponse[];
}

export interface PaymentResponse {
  description: string;
  value: number;
  date: Date;
  creatorID: string;
  usersID: string[];
  time: Date;
}
