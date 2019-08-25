import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database.module';
import { AccountsController } from './accounts.controller';
import { accountsProviders } from './accounts.providers';
import { AccountsService } from './accounts.service';
import { customersProviders } from '../customers/customers.providers';
import { CustomersService } from '../customers/customers.service';
import { CryptographyService } from 'src/services/cryptography.service';
import { ConfigService } from 'src/services/config.service';
import { applicationsProviders } from '../applications/applications.providers';
import { ApplicationsService } from '../applications/applications.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AccountsController],
  providers: [
    ...accountsProviders,
    AccountsService,
    ...customersProviders,
    ...applicationsProviders,
    ApplicationsService,
    CustomersService,
    CryptographyService,
    ConfigService,
  ],
})
export class AccountsModule {}
