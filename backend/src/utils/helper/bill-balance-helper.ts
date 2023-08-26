import { UserInBill } from "interfaces/bill";
import { Participant } from "interfaces/participant";
import { Payment } from "interfaces/payment";
import { Transaction } from "interfaces/transaction";

class BillBalanceHelper {
  private payments: Payment[] = [];
  private users: UserInBill[] = [];
  private costs: { [key: string]: number } = {};
  private balance: { [key: string]: number } = {};
  private sumPayments: { [key: string]: number } = {};
  private participants: Participant[] = [];
  private transactions: Transaction[] = [];

  constructor(users: UserInBill[], payments: Payment[]) {
    this.payments = payments;
    this.users = users;

    this.calc();
  }

  public getTransactions(): Transaction[] {
    return this.transactions;
  }

  public getBalance() {
    return this.balance;
  }

  private calc() {
    this.calcCosts();
    this.calcSumPayments();

    this.calcBalance();

    this.calcParticipants();

    this.participants.sort((a, b) => a.balance - b.balance);

    this.calcTransactions();
  }

  private calcCosts() {
    for (const payment of this.payments) {
      if (payment.isDelete) continue;

      const sharePerPerson = payment.value / payment.usersID.length;
      for (const person of payment.usersID) {
        if (this.costs[person]) {
          this.costs[person] += sharePerPerson;
        } else {
          this.costs[person] = sharePerPerson;
        }
      }
    }
  }

  private calcSumPayments() {
    for (const payment of this.payments) {
      if (payment.isDelete) continue;

      if (this.sumPayments[payment.creatorID]) {
        this.sumPayments[payment.creatorID] += payment.value;
      } else {
        this.sumPayments[payment.creatorID] = payment.value;
      }
    }

    return this.sumPayments;
  }

  private calcBalance() {
    for (const user of this.users) {
      this.balance[user.userID] =
        this.sumPayments[user.userID] - this.costs[user.userID];
    }
  }

  private calcParticipants() {
    for (const user of this.users) {
      this.participants.push({
        userID: user.userID,
        balance: this.balance[user.userID],
      });
    }
  }

  private calcTransactions() {
    const tempParticipants = [...this.participants];

    while (tempParticipants.length !== 0) {
      const left = tempParticipants[0];
      const leftAbsBalance = Math.abs(left.balance);

      const right = tempParticipants[tempParticipants.length - 1];
      const rightAbsBalance = Math.abs(right.balance);

      if (leftAbsBalance < rightAbsBalance) {
        this.leftIsSmaller(tempParticipants, this.transactions, left, right);
      } else if (leftAbsBalance > rightAbsBalance) {
        this.leftIsBigger(tempParticipants, this.transactions, left, right);
      } else {
        this.leftIsEqual(tempParticipants, this.transactions, left, right);
      }
    }
  }

  private leftIsSmaller(
    participants: Participant[],
    transactions: Transaction[],
    left: Participant,
    right: Participant
  ) {
    participants[participants.length - 1].balance += left.balance;

    transactions.push({
      fromUserID: left.userID,
      toUserID: right.userID,
      amount: left.balance,
    });

    participants.splice(0, 1);
  }

  private leftIsBigger(
    participants: Participant[],
    transactions: Transaction[],
    left: Participant,
    right: Participant
  ) {
    participants[0].balance += right.balance;

    transactions.push({
      fromUserID: left.userID,
      toUserID: right.userID,
      amount: right.balance * -1,
    });

    participants.splice(participants.length - 1, 1);
  }

  private leftIsEqual(
    participants: Participant[],
    transactions: Transaction[],
    left: Participant,
    right: Participant
  ) {
    transactions.push({
      fromUserID: left.userID,
      toUserID: right.userID,
      amount: left.balance,
    });

    participants.splice(participants.length - 1, 1);
    participants.splice(0, 1);
  }
}

export default BillBalanceHelper;
