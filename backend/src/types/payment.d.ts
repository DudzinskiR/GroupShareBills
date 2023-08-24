export interface Payment {
  description: string;
  value: number;
  date: Date;
  creatorID: string;
  usersID: string[];
}
