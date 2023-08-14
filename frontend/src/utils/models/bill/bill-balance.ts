export interface BillBalance {
  balance: number;
  users: BillBalanceUser[];
}

export interface BillBalanceUser {
  name: string;
  id: string;
  balance: number;
}
