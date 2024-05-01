import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpStatus,
  HttpCode,
  SerializeOptions,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles/roles.guard';
import { AddressesService } from './addresses-service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UserDecorator } from 'src/users/user.decorator';
import { Address } from './domain/address';
import { QueryAddressDto } from './dto/query-address.dto';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { NullableType } from 'src/utils/types/nullable.type';
import { UpdateAddressDto } from './dto/update-address.dto';

@ApiBearerAuth()
@Roles(RoleEnum.user, RoleEnum.admin)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Addresses')
@Controller({
  path: 'addresses',
  version: '1',
})
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @SerializeOptions({
    groups: ['me'],
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createAddressDto: CreateAddressDto,
    @UserDecorator('id') logedInUserId: string,
  ): Promise<Address> {
    const logedInUser = await this.addressesService.checkUser(logedInUserId);
    return this.addressesService.create(createAddressDto, logedInUser);
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryAddressDto,
    @UserDecorator('id') logedInUserId: string,
  ): Promise<InfinityPaginationResultType<Address>> {
    const logedInUser = await this.addressesService.checkUser(logedInUserId);
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.addressesService.findManyWithPagination({
        sortOptions: query?.sort,
        paginationOptions: {
          page,
          limit,
        },
        logedInUser,
      }),
      { page, limit },
    );
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  async findOneById(
    @Param('id') id: Address['id'],
    @UserDecorator('id') logedInUserId: string,
  ): Promise<NullableType<Address>> {
    const logedInUser = await this.addressesService.checkUser(logedInUserId);
    return this.addressesService.findOne({ id }, logedInUser);
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Get('/name/:name')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'name',
    type: String,
    required: true,
  })
  async findOneByName(
    @Param('name') name: string,
    @UserDecorator('id') logedInUserId: string,
  ): Promise<NullableType<Address>> {
    const logedInUser = await this.addressesService.checkUser(logedInUserId);
    console.log('findOneByName name', name);
    return this.addressesService.findOne({ name }, logedInUser);
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Get('/email/:email')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'email',
    type: String,
    required: true,
  })
  async findOneByEmail(
    @Param('email') email: string,
    @UserDecorator('id') logedInUserId: string,
  ): Promise<NullableType<Address>> {
    const logedInUser = await this.addressesService.checkUser(logedInUserId);
    return this.addressesService.findOne({ email }, logedInUser);
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Get('/address/:address')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'address',
    type: String,
    required: true,
  })
  async findOneByAddress(
    @Param('address') address: string,
    @UserDecorator('id') logedInUserId: string,
  ): Promise<NullableType<Address>> {
    const logedInUser = await this.addressesService.checkUser(logedInUserId);
    return this.addressesService.findOne({ address }, logedInUser);
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: Address['id'],
    @Body() updateAddressDto: UpdateAddressDto,
    @UserDecorator('id') logedInUserId: string,
  ): Promise<Address | null> {
    const logedInUser = await this.addressesService.checkUser(logedInUserId);
    return this.addressesService.update(id, updateAddressDto);
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: Address['id']): Promise<void> {
    return this.addressesService.softDelete(id);
  }
}
