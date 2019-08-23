import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './services/config.module';
import { CryptographyModule } from './services/cryptography.module';

@Module({
  imports: [ConfigModule, CryptographyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
