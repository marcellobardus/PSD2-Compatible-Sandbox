import { Controller, Post, Body, Headers, Get, Param } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CryptographyService } from 'src/services/cryptography.service';
import { ApiUseTags, ApiResponse } from '@nestjs/swagger';
import {
  ApplicationSignupDto,
  AuthorizeApplicationAsCustomerDto,
} from './applications.dtos';
import {
  PayloadError,
  AuthorizationError,
  NoErrorResponse,
} from 'src/utils/responses';

import { SHA256, enc } from 'crypto-js';
import {
  ApplicationSignupDro,
  AuthorizeApplicationAsCustomerDro,
  ClaimAPIKeyDro,
} from './applications.dros';
import { AccountsService } from '../accounts/accounts.service';
import { CustomersService } from '../customers/customers.service';

import { includes } from 'lodash';
import { randomBytes } from 'crypto';

@ApiUseTags('applications')
@Controller('applications')
export class ApplicationsController {
  constructor(
    private readonly applicationsService: ApplicationsService,
    private readonly customersService: CustomersService,
    private readonly accountsService: AccountsService,
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

  @Post('authorize-application-as-customer')
  @ApiResponse({ status: 401, type: AuthorizationError })
  @ApiResponse({ status: 400, type: PayloadError })
  @ApiResponse({ status: 201, type: AuthorizeApplicationAsCustomerDro })
  async authorizeApplicationAsCustomer(
    @Headers('session') session: string,
    @Body()
    authorizeApplicationAsCustomerDto: AuthorizeApplicationAsCustomerDto,
  ) {
    const customer = await this.customersService.getCustomerBySession(session);

    if (!customer) {
      return new AuthorizationError('Invalid session');
    }

    const isCustomerOwnerOfAccount = includes(
      customer.accountsIds,
      authorizeApplicationAsCustomerDto.accountID,
    );

    if (!isCustomerOwnerOfAccount) {
      return new AuthorizationError(
        "Invalid account ID to authorize an application to use it you need to be it's owner",
      );
    }

    const application = await this.applicationsService.getApplicationByID(
      authorizeApplicationAsCustomerDto.appID,
    );

    if (!application) {
      return new PayloadError('Application with the given ID does not exist');
    }

    await this.applicationsService.pushNewAccess(
      application.appID,
      authorizeApplicationAsCustomerDto.accountID,
    );

    await this.accountsService.updateAccountAccesses(
      authorizeApplicationAsCustomerDto.accountID,
      application.appID,
      Date.now() / 1000,
      authorizeApplicationAsCustomerDto.accessType,
    );

    const tmpCode = randomBytes(4)
      .toString()
      .toUpperCase();

    await this.accountsService.setApplicationAccountTmpKey(
      authorizeApplicationAsCustomerDto.accountID,
      application.appID,
      tmpCode,
    );
    return {
      error: false,
      tmpCode,
      accountID: authorizeApplicationAsCustomerDto.accountID,
    };
  }

  @Get('claim-api-key/:tmpCode')
  @ApiResponse({ status: 200, type: ClaimAPIKeyDro })
  @ApiResponse({ status: 400, type: PayloadError })
  @ApiResponse({ status: 401, type: AuthorizationError })
  async claimAPIKey(
    @Headers('signature') signature: string,
    @Headers('appID') appID: string,
    @Headers('accountID') accountID: number,
    @Param('tmpCode') tmpCode: string,
  ) {
    const application = await this.applicationsService.getApplicationByID(
      appID,
    );

    if (!application) {
      return new PayloadError('Invalid application ID');
    }

    const isSignatureValid = this.cryptographyService.isSignatureValid(
      application.pubkey,
      tmpCode,
      signature,
    );

    if (!isSignatureValid) {
      return new AuthorizationError('Signature mismatch');
    }

    const account = await this.accountsService.getAccountByID(accountID);

    if (!account) {
      return new PayloadError('Invalid Account ID');
    }

    const isTmpCodeValid =
      tmpCode === account.accesses[appID].APIKeyClaimTmpCode;

    if (!isTmpCodeValid) {
      return new AuthorizationError('Invalid api key claim code');
    }

    const APIKEY = randomBytes(6)
      .toString()
      .toUpperCase();

    await this.accountsService.setApplicationAccountAPIKey(
      accountID,
      application.appID,
      APIKEY,
    );

    return { error: false, ApiKey: APIKEY };
  }
}
