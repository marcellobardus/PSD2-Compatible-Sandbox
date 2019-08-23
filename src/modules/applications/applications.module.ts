import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database.module';
import { ApplicationsController } from './applications.controller';
import { applicationsProviders } from './applications.providers';
import { ApplicationsService } from './applications.service';
import { CryptographyService } from 'src/services/cryptography.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ApplicationsController],
  providers: [
    ...applicationsProviders,
    ApplicationsService,
    CryptographyService,
  ],
})
export class ApplicationsModule {}
