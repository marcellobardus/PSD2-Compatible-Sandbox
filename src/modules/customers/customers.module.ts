import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database.module';
import { CustomersController } from './customers.controller';
import { customersProviders } from './customers.providers';
import { CustomersService } from './customers.service';

@Module({
  imports: [DatabaseModule],
  controllers: [CustomersController],
  providers: [...customersProviders, CustomersService],
})
export class CustomersModule {}
