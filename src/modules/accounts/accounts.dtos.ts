import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RegisterAccountDto {
  @ApiModelProperty()
  @IsNotEmpty()
  readonly currency: string;

  @ApiModelProperty()
  @IsNotEmpty()
  readonly accountTypeDescription: string;

  @ApiModelProperty()
  @IsNotEmpty()
  readonly accountTypeCode: string;

  @ApiModelProperty()
  @IsNotEmpty()
  readonly accountTypeName: string;

  @ApiModelProperty()
  @IsNotEmpty()
  readonly accountNameClient: string;

  @ApiModelProperty({ required: false })
  readonly toCustomerID: string;

  @ApiModelProperty({ required: false })
  readonly customerName: string;

  @ApiModelProperty({ required: false })
  readonly customerSurname: string;
}
