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
      type: Number,
      required: true,
    },
    hasAccessToAccountsIDs: {
      type: Array,
      required: true,
      default: [],
    },
  },
  { versionKey: false },
);
