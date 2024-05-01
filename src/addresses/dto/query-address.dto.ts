import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';
import { User } from 'src/users/domain/user';
import { Address } from '../domain/address';
import { FileType } from 'src/files/domain/file';
import { Key } from 'src/keys/domain/key';
import { Role } from 'src/roles/domain/role';
import { Status } from 'src/statuses/domain/status';

export class UserDto implements User {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  email?: string | null | undefined;

  zkAppAddress?: string | null | undefined;
  minaAddress?: string | null | undefined;
  key?: Key | null | undefined;
  otpKey?: Key | null | undefined;
  password?: string | undefined;
  previousPassword?: string | undefined;
  provider: string;
  socialId?: string | null | undefined;
  firstName: string | null;
  lastName: string | null;
  photo?: FileType | null | undefined;
  role?: Role | null | undefined;
  status?: Status | undefined;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  createdBy?: User | null | undefined;
  updatedBy?: User | null | undefined;
}

export class FilterAddressDto {
  @ApiPropertyOptional({ type: UserDto })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UserDto)
  users?: UserDto[] | null;
}

export class SortAddressDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  orderBy: keyof Address;

  @ApiProperty()
  @IsString()
  order: string;
}

export class QueryAddressDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number;

  // @ApiPropertyOptional({ type: String })
  // @IsOptional()
  // @Transform(({ value }) =>
  //   value ? plainToInstance(FilterAddressDto, JSON.parse(value)) : undefined,
  // )
  // @ValidateNested()
  // @Type(() => FilterAddressDto)
  // filters?: FilterAddressDto | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) => {
    return value
      ? plainToInstance(SortAddressDto, JSON.parse(value))
      : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortAddressDto)
  sort?: SortAddressDto[] | null;
}
