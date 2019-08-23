import { Controller, Post, Body, Headers } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CryptographyService } from 'src/services/cryptography.service';
import { ApiUseTags, ApiResponse } from '@nestjs/swagger';
import { ApplicationSignupDto } from './applications.dtos';
import { PayloadError } from 'src/utils/responses';

import { SHA256, enc } from 'crypto-js';
import { ApplicationSignupDro } from './applications.dros';

@ApiUseTags('applications')
@Controller('applications')
export class ApplicationsController {
  constructor(
    private readonly applicationsService: ApplicationsService,
    private readonly cryptographyService: CryptographyService,
  ) {}

  @Post('signup')
  @ApiResponse({ status: 400, type: PayloadError })
  @ApiResponse({ status: 201, type: ApplicationSignupDro })
  async signup(
    @Headers('signature') signature: string,
    @Body() applicationSignupDto: ApplicationSignupDto,
  ): Promise<PayloadError | ApplicationSignupDro> {
    const isSignatureValid = await this.cryptographyService.isSignatureValid(
      applicationSignupDto.pubkey,
      applicationSignupDto.pubkey,
      signature,
    );

    if (!isSignatureValid) {
      return new PayloadError('Signature mismatch');
    }

    const applications = await this.applicationsService.getAll();

    const appID = SHA256(applications.length.toString()).toString(enc.Hex);
    await this.applicationsService.register({
      appName: applicationSignupDto.appName,
      appDescription: applicationSignupDto.appDescription,
      appID,
      pubkey: applicationSignupDto.pubkey,
    });

    return { error: false, appID };
  }
}
