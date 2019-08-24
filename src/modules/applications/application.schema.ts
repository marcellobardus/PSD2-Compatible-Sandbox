import { Schema } from 'mongoose';

export const ApplicationSchema = new Schema(
  {
    appName: {
      type: String,
      required: true,
    },
    appDescription: {
      type: String,
      required: false,
    },
    appID: {
      type: String,
      required: true,
    },
    hasAccessToAccountsIDs: {
      type: Array,
      required: true,
      default: [],
    },
    pubkey: {
      type: String,
      required: true,
    },
  },
  { versionKey: false },
);
