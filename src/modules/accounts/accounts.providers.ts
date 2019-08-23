import { Connection } from 'mongoose';

import { AccountSchema } from './account.schema';
import {
  ACCOUNTS_SCHEMA_PROVIDER,
  DATABASE_PROVIDER,
} from '../../utils/constants';

export const accountsProviders = [
  {
    provide: ACCOUNTS_SCHEMA_PROVIDER,
    useFactory: (connection: Connection) =>
      connection.model('Account', AccountSchema),
    inject: [DATABASE_PROVIDER],
  },
];
