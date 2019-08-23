import { Connection } from 'mongoose';

import { ApplicationSchema } from './application.schema';
import {
  DATABASE_PROVIDER,
  APPLICATION_SCHEMA_PROVIDER,
} from '../../utils/constants';

export const applicationsProviders = [
  {
    provide: APPLICATION_SCHEMA_PROVIDER,
    useFactory: (connection: Connection) =>
      connection.model('Application', ApplicationSchema),
    inject: [DATABASE_PROVIDER],
  },
];
