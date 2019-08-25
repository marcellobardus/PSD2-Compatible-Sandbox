import { Controller, Post, Body, Headers, Get } from '@nestjs/common';
import { ApiUseTags, ApiResponse } from '@nestjs/swagger';

import { CustomersService } from './customers.service';
import { RegisterCustomerDto, LoginCustomerDto } from './customers.dtos';
import { CryptographyService } from 'src/services/cryptography.service';
import { ConfigService } from 'src/services/config.service';
import {
  AuthorizationError,
  PayloadError,
  NoErrorResponse,
} from 'src/utils/responses';
import { ObjectHasher } from 'src/utils/hash.object';

import { randomBytes } from 'crypto';

import { SHA256, enc } from 'crypto-js';
import { CustomerRegisteredDro, CustomerLoginDro } from './customers.dros';

@ApiUseTags('customers')
@Controller('customers')
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
    private readonly cryptographyService: CryptographyService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  @ApiResponse({ status: 401, type: AuthorizationError })
  @ApiResponse({ status: 201, type: CustomerRegisteredDro })
  async registerUser(
    @Headers('caller') caller: string,
    @Headers('signature') signature: string,
    @Body() registerCustomerDto: RegisterCustomerDto,
  ): Promise<AuthorizationError | CustomerRegisteredDro> {
    if (caller !== this.configService.getMasterPublicKey()) {
      return new AuthorizationError('Invalid caller');
    }

    const payloadHash = await ObjectHasher.hashObject(registerCustomerDto);

    const isSignatureValid = await this.cryptographyService.isSignatureValid(
      caller,
      payloadHash,
      signature,
    );

    if (!isSignatureValid) {
      return new AuthorizationError('Signature mismatch');
    }

    const clientID = randomBytes(4)
      .toString('hex')
      .toLocaleUpperCase();

    const hashedPassword = SHA256(registerCustomerDto.passwordHash).toString(
      enc.Hex,
    );

    await this.customersService.create({
      name: registerCustomerDto.name,
      surname: registerCustomerDto.surname,
      address: registerCustomerDto.address,
      passwordHash: hashedPassword,
      clientID,
    });

    return { error: false, customerID: clientID };
  }

  @Post('login')
  @ApiResponse({ status: 401, type: AuthorizationError })
  @ApiResponse({ status: 400, type: PayloadError })
  @ApiResponse({ status: 201, type: CustomerLoginDro })
  async login(@Body() loginCustomerDto: LoginCustomerDto) {
    const customer = await this.customersService.getByClientID(
      loginCustomerDto.clientID,
    );

    if (!customer) {
      return new PayloadError('Customer with the given ID does not exist');
    }

    const isPasswordCorrect =
      SHA256(loginCustomerDto.passwordHash).toString(enc.Hex) ===
      customer.passwordHash;

    if (!isPasswordCorrect) {
      return new AuthorizationError('Invalid credentials');
    }

    const session = SHA256(randomBytes(64).toString()).toString(enc.Hex);

    const sessionExpirationTime =
      Date.now() / 1000 +
      Number(this.configService.config.sessionExpirationAfterMinutes) * 60;

    await this.customersService.setSession(
      customer.clientID,
      session,
      sessionExpirationTime,
    );

    return { error: false, session, expirationTime: sessionExpirationTime };
  }

  @Get('customer-accounts-as-application')
  async getCustomersAccountsAsApplication(@Headers('appID') appID: string) {}
}
