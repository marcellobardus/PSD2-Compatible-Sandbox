import { Schema } from 'mongoose';

export const CustomersSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    clientID: {
      type: String,
      required: true,
    },
    accountsIds: {
      type: Array,
      required: true,
      default: [],
    },
    passwordHash: {
      type: String,
      required: true,
    },
    session: {
      type: String,
    },
    sessionExpirationTime: {
      type: Number,
    },
  },
  { versionKey: false },
);
