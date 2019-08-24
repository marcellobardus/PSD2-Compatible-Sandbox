import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database.module';
import { ApplicationsController } from './applications.controller';
import { applicationsProviders } from './applications.providers';
import { ApplicationsService } from './applications.service';
import { CryptographyService } from 'src/services/cryptography.service';
import { accountsProviders } from '../accounts/accounts.providers';
import { AccountsService } from '../accounts/accounts.service';
import { customersProviders } from '../customers/customers.providers';
import { CustomersService } from '../customers/customers.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ApplicationsController],
  providers: [
    ...applicationsProviders,
    ApplicationsService,
    ...customersProviders,
    CustomersService,
    ...accountsProviders,
    AccountsService,
    CryptographyService,
  ],
})
export class ApplicationsModule {}
