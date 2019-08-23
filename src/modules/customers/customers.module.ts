import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database.module';
import { CustomersController } from './customers.controller';
import { customersProviders } from './customers.providers';
import { CustomersService } from './customers.service';
import { CryptographyService } from 'src/services/cryptography.service';
import { ConfigService } from 'src/services/config.service';

@Module({
  imports: [DatabaseModule],
  controllers: [CustomersController],
  providers: [
    ...customersProviders,
    CustomersService,
    CryptographyService,
    ConfigService,
  ],
})
export class CustomersModule {}
