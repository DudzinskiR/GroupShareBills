export interface BillBalance {
  balance: number;
  users: BillBalanceUser[];
}

export interface BillBalanceUser {
  id: string;
  balance: number;
}
