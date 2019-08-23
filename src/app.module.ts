import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from './services/config.module';
import { CryptographyModule } from './services/cryptography.module';
import { CustomersModule } from './modules/customers/customers.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { ApplicationsModule } from './modules/applications/applications.module';

@Module({
  imports: [
    ConfigModule,
    CryptographyModule,
    CustomersModule,
    AccountsModule,
    ApplicationsModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
