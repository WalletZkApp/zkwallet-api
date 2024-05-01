import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { SignedDataDto } from './signed-data.dto';

export class AuthWeb3LoginDto {
  @ApiProperty()
  @IsNotEmpty()
  network: string;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => SignedDataDto)
  signedData: SignedDataDto;

  @ApiPropertyOptional()
  @IsOptional()
  zkAppAddress?: string;

  @ApiPropertyOptional()
  @IsOptional()
  sharedKey?: string;

  @ApiPropertyOptional()
  @IsOptional()
  sharesOtpKey?: string;
}
