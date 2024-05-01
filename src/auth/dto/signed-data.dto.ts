import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class SignatureDto {
  @ApiProperty()
  @IsNotEmpty()
  field: string;

  @ApiProperty()
  @IsNotEmpty()
  scalar: string;
}

export class SignedDataDto {
  @ApiProperty()
  @IsNotEmpty()
  publicKey: string;

  @ApiProperty()
  @IsNotEmpty()
  data: string;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => SignatureDto)
  signature: SignatureDto;
}
