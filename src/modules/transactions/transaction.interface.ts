import { Document } from 'mongoose';

export interface TransactionInterface extends Document {
  readonly id: number;

  readonly amount: number;
  readonly currency: string;
  readonly description: string;

  readonly transactionType: string;

  readonly tradeDate: number;

  readonly transactionCategory: 'debit' | 'credit';

  readonly transactionStatus: 'hold' | 'booked' | 'rejected';

  readonly sender: {
    accountNumber: number;
    name: string;
    surname: string;
    address: string;
  };

  readonly recipient: {
    accountNumber: number;
    name: string;
    surname: string;
    address: string;
  };

  readonly bookingDate: number | null;
  readonly postTransactionBalance: number | null;

  readonly cardInfo: { cardHolder: string; cardNumber: number } | null;

  readonly holdExpirationDate: number | null;
}
