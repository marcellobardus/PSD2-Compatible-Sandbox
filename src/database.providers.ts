import * as mongoose from 'mongoose';
import { DATABASE_PROVIDER } from './utils/constants';

export const databaseProviders = [
  {
    provide: DATABASE_PROVIDER,
    useFactory: async () => {
      (mongoose as any).Promise = global.Promise;
      return await mongoose.connect(
        'mongodb://' +
          process.env.DATABASE_HOST_NAME +
          ':27017/' +
          process.env.DATABASE_NAME,
      );
    },
  },
];
