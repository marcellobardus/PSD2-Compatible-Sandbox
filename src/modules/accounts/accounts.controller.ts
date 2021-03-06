import { Controller, Post, Headers, Body, Get, Param } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CryptographyService } from 'src/services/cryptography.service';
import { ConfigService } from 'src/services/config.service';
import { ApiUseTags, ApiResponse } from '@nestjs/swagger';
import { RegisterAccountDto } from './accounts.dtos';
import { AuthorizationError, PayloadError } from 'src/utils/responses';
import { ObjectHasher } from 'src/utils/hash.object';
import { CustomersService } from '../customers/customers.service';
import { CustomerInterface } from '../customers/customer.interface';
import { AccountInterface } from './account.interface';
import {
  GetCustomerAccountsDro,
  RegisterAccountDro,
  GetAccountInfoAsApplicationDro,
} from './accounts.dros';
import { ApplicationsService } from '../applications/applications.service';

import { SHA256, enc } from 'crypto-js';
@ApiUseTags('accounts')
@Controller('accounts')
export class AccountsController {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly customersService: CustomersService,
    private readonly applicationsService: ApplicationsService,
    private readonly cryptographyService: CryptographyService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  @ApiResponse({ status: 400, type: PayloadError })
  @ApiResponse({ status: 401, type: AuthorizationError })
  @ApiResponse({ status: 201, type: RegisterAccountDto })
  async registerAccount(
    @Headers('caller') caller: string,
    @Headers('signature') signature: string,
    @Body() registerAccountDto: RegisterAccountDto,
  ): Promise<PayloadError | AuthorizationError | RegisterAccountDro> {
    if (caller !== this.configService.getMasterPublicKey()) {
      return new AuthorizationError('Invalid caller');
    }

    const payloadHash = await ObjectHasher.hashObject(registerAccountDto);

    const isSignatureValid = await this.cryptographyService.isSignatureValid(
      caller,
      payloadHash,
      signature,
    );

    if (!isSignatureValid) {
      return new AuthorizationError('Signature mismatch');
    }

    const accounts = await this.accountsService.getAll();
    const accountID = accounts.length;

    const number = Number(
      Math.random() * (999999999999 - 100000000000) + 100000000000,
    ).toFixed();

    const IBAN =
      this.configService.config.CountryCode +
      this.configService.config.BicOrSwift +
      this.configService.config.branchCode +
      number.toString();

    let customer: CustomerInterface;
    if (registerAccountDto.toCustomerID) {
      customer = await this.customersService.getByClientID(
        registerAccountDto.toCustomerID,
      );
      if (!customer) {
        return new PayloadError('Invalid ClientID');
      }
    } else if (
      registerAccountDto.customerName &&
      registerAccountDto.customerSurname
    ) {
      customer = await this.customersService.getByNameAndSurname(
        registerAccountDto.customerName,
        registerAccountDto.customerSurname,
      );
      if (!customer) {
        return new PayloadError(
          'Invalid params, client with the given name and surname does not exist',
        );
      }
    } else {
      return new PayloadError(
        'Please specify the customer ID property or name and surname properties',
      );
    }

    await this.customersService.attachAccount(customer.clientID, accountID);

    await this.accountsService.create({
      accountID,
      currency: registerAccountDto.currency,
      accountNumber: IBAN,
      accountTypeDescription: registerAccountDto.accountTypeDescription,
      accountTypeCode: registerAccountDto.accountTypeCode,
      accountNameClient: registerAccountDto.accountNameClient,
      accountTypeName: registerAccountDto.accountTypeName,
    });
    return { error: false, accountID, IBAN };
  }

  @Get('get-all')
  @ApiResponse({ status: 401, type: AuthorizationError })
  @ApiResponse({ status: 200, type: GetCustomerAccountsDro })
  async getAllAccounts(@Headers('session') session: string) {
    const customer = await this.customersService.getCustomerBySession(session);

    if (!customer) {
      return new AuthorizationError('Invalid session');
    }

    let accounts: Array<AccountInterface> = [];

    for (const accountId of customer.accountsIds) {
      const account = await this.accountsService.getAccountByID(accountId);

      const allowedApplications = Object.keys(account.accesses);

      for (const applicationName of allowedApplications) {
        delete account.accesses[applicationName].apiKey;
        delete account.accesses[applicationName].APIKeyClaimTmpCode;
      }

      accounts.push(account);
    }

    return { error: false, accounts };
  }

  @Get('get-account-info-as-application/:accountID')
  @ApiResponse({ status: 200, type: GetAccountInfoAsApplicationDro })
  async getAccountInfoAsApplication(
    @Headers('appid') appID: string,
    @Headers('signature') signature: string,
    @Headers() Headers: any,
    @Param('accountID') accountID: number,
  ) {
    const account = await this.accountsService.getAccountByID(accountID);

    if (!account) {
      console.log(accountID);

      return new PayloadError('Invalid account ID');
    }

    if (!account.accesses[appID]) {
      return new AuthorizationError(
        'The given app ID does not have access to this account',
      );
    }

    const payloadHash = SHA256(accountID.toString()).toString(enc.Hex);

    const application = await this.applicationsService.getApplicationByID(
      appID,
    );

    if (!application) {
      return new PayloadError('Invalid app ID');
    }

    const isSignatureValid = this.cryptographyService.isSignatureValid(
      application.pubkey,
      payloadHash,
      signature,
    );

    if (!isSignatureValid) {
      return new AuthorizationError('Signature mismatch');
    }

    delete account.accesses;

    return { error: false, ...account };
  }

  @Post('set-balance')
  async setAccountBalance() {}
}
