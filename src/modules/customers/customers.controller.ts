import { Controller, Post, Body, Headers } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';

import { CustomersService } from './customers.service';
import { RegisterCustomerDto } from './customers.dtos';
import { CryptographyService } from 'src/services/cryptography.service';
import { ConfigService } from 'src/services/config.service';

@ApiUseTags('customers')
@Controller('customers')
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
    private readonly cryptographyService: CryptographyService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  async registerUser(
    @Headers('caller') caller: string,
    @Headers('signature') signature: string,
    @Body() registerCustomerDto: RegisterCustomerDto,
  ) {}
}
