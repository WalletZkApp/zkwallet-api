import { PartialType, ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';
import { CreateAddressDto } from './create-address.dto';
import { User } from 'src/users/domain/user';

export class UpdateAddressDto extends PartialType(CreateAddressDto) {
  @ApiPropertyOptional()
  @IsOptional()
  name?: string | null;

  @ApiPropertyOptional({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @IsOptional()
  @IsEmail()
  email?: string | null;

  @ApiProperty()
  @IsNotEmpty()
  address: string;

  updatedBy?: User | null;
}
