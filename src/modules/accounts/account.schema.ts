import { Schema } from 'mongoose';

export const AccountSchema = new Schema(
  {
    accountID: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    bookingBalance: {
      type: Number,
      required: true,
      default: 0,
    },
    availableBalance: {
      type: Number,
      required: true,
      default: 0,
    },
    accountNumber: {
      type: String,
      required: true,
    },
    accountTypeDescription: {
      type: String,
      required: true,
    },
    accountTypeCode: {
      type: String,
      required: true,
    },
    accountTypeName: {
      type: String,
      required: true,
    },
    accountNameClient: {
      type: String,
      required: true,
    },
    accesses: {
      type: Object,
      required: true,
      default: {},
    },
  },
  { versionKey: false },
);
