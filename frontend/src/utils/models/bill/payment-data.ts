export interface PaymentData {
  description: string;
  value: number;
  time: number;
  creatorID: string;
  usersID: string[];
  id: string;
}

export interface PaymentHistoryData {
  time: number;
  payments: PaymentData[];
}
