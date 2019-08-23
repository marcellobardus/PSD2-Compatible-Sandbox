import { Schema } from 'mongoose';

export const TransactionSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: true,
    },
    transactionType: {
      type: String,
      required: true,
    },
    tradeDate: {
      type: String,
      required: true,
      default: Date.now() / 1000,
    },
    transactionCategory: {
      type: String,
      required: true,
    },
    transactionStatus: {
      type: String,
      required: true,
    },
    sender: {
      type: Object,
      required: true,
    },
    recipient: {
      type: Object,
      required: true,
    },
    bookingDate: {
      type: Number,
      required: false,
    },
    postTransactionBalance: {
      type: Number,
      required: false,
    },
    cardInfo: {
      type: Object,
      required: false,
    },
    holdExpirationDate: {
      type: Number,
      required: false,
    },
  },
  { versionKey: false },
);
