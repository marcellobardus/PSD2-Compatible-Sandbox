import { Controller, Post, Body, Headers, Get, Param } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CryptographyService } from 'src/services/cryptography.service';
import { ApiUseTags, ApiResponse } from '@nestjs/swagger';
import {
  ApplicationSignupDto,
  AuthorizeApplicationAsCustomerDto,
} from './applications.dtos';
import { PayloadError, AuthorizationError } from 'src/utils/responses';

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
  ) {
    this.applicationsService.getAll().then(console.log);
  }

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

    if (
      !includes(
        application.hasAccessToAccountsIDs,
        authorizeApplicationAsCustomerDto.accountID,
      )
    ) {
      await this.applicationsService.pushNewAccess(
        application.appID,
        authorizeApplicationAsCustomerDto.accountID,
      );
    }

    const account = await this.accountsService.getAccountByID(
      authorizeApplicationAsCustomerDto.accountID,
    );
    let newAccesses = account.accesses;

    const tmpCode = randomBytes(6)
      .toString('hex')
      .toUpperCase();

    newAccesses[application.appID] = {
      authorizationDate: Date.now() / 1000,
      accessType: authorizeApplicationAsCustomerDto.accessType,
      APIKeyClaimTmpCode: tmpCode,
      apiKey: null,
    };

    await this.accountsService.updateAccountAccesses(
      authorizeApplicationAsCustomerDto.accountID,
      newAccesses,
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
    @Headers('appid') appID: string,
    @Headers('accountid') accountID: number,
    @Param('tmpCode') tmpCode: string,
    @Headers() headers: any,
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
    console.log(headers);

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

    let newAccesses = account.accesses;

    newAccesses[application.appID].apiKey = APIKEY;

    await this.accountsService.updateAccountAccesses(accountID, newAccesses);

    return { error: false, ApiKey: APIKEY, accountID };
  }
}
