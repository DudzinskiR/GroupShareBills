interface Payment {
  value: number;
  creatorID: string;
  usersID: string[];
}

interface Transaction {
  from: string;
  to: string;
  amount: number;
}

interface Participant {
  id: string;
  balance: number;
}

function minimizePayments(payments: Payment[]): Transaction[] {
  const balances: { [id: string]: number } = {};

  // Przygotowanie początkowych sald na podstawie płatności
  for (const payment of payments) {
    const splitAmount = payment.value / payment.usersID.length;

    for (const userID of payment.usersID) {
      if (userID !== payment.creatorID) {
        balances[userID] = (balances[userID] || 0) + splitAmount;
      }
    }
  }

  const participants: Participant[] = Object.keys(balances).map((id) => ({
    id,
    balance: balances[id],
  }));
  const transactions: Transaction[] = [];

  // Wywołanie algorytmu Dine'a-Hirschberga
  participants.sort((a, b) => a.balance - b.balance);

  let left = 0;
  let right = participants.length - 1;

  while (left < right) {
    const amount = Math.min(
      Math.abs(participants[left].balance),
      Math.abs(participants[right].balance)
    );

    participants[left].balance +=
      participants[left].balance > 0 ? -amount : amount;
    participants[right].balance +=
      participants[right].balance > 0 ? -amount : amount;

    transactions.push({
      from: participants[right].id,
      to: participants[left].id,
      amount,
    });

    if (Math.abs(participants[left].balance) < 1e-9) left++;
    if (Math.abs(participants[right].balance) < 1e-9) right--;
  }

  if (left === right) {
    participants[left].balance = 0;
  }

  return transactions;
}

// Przykładowe użycie
const payments: Payment[] = [
  { value: 50, creatorID: "B", usersID: ["A"] },
  { value: 30, creatorID: "C", usersID: ["A"] },
  { value: 50, creatorID: "B", usersID: ["A"] },
  { value: 30, creatorID: "C", usersID: ["A"] },
];

const transactions = minimizePayments(payments);
console.log(transactions);
