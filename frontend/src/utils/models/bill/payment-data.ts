export interface PaymentData {
  description: string;
  value: number;
  date: Date;
  creatorID: string;
  usersID: string[];
  id: string;
}

export interface PaymentHistoryData {
  date: Date;
  payment: PaymentData[];
}
