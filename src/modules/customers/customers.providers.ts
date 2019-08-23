import { Connection } from 'mongoose';

import { CustomersSchema } from './customer.schema';
import {
  CUSTOMER_SCHEMA_PROVIDER,
  DATABASE_PROVIDER,
} from '../../utils/constants';

export const customersProviders = [
  {
    provide: CUSTOMER_SCHEMA_PROVIDER,
    useFactory: (connection: Connection) =>
      connection.model('Customer', CustomersSchema),
    inject: [DATABASE_PROVIDER],
  },
];
