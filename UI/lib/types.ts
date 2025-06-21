// Transaction data types
export interface Transaction {
  id: number;
  cardNumber: string;
  cardType: string;
  amount: number;
  transactionTimeStamp: string;
  transactionStatus: number;
  transactionProcessedTimeStamp: string;
}

// Report types
export interface CardReport {
  cardNumber: string;
  transactionCount: number;
  totalAmount: number;
}

export interface CardTypeReport {
  cardType: string;
  transactionCount: number;
  totalAmount: number;
}

export interface DailyReport {
  transactionDate: string;
  transactionCount: number;
  totalAmount: number;
}
