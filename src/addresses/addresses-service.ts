import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AddressRepository } from './infrastructure/persistence/address.repository';
import { CreateAddressDto } from './dto/create-address.dto';
import { Address } from './domain/address';
import { UsersService } from 'src/users/users.service';
import { SortAddressDto } from './dto/query-address.dto';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { NullableType } from 'src/utils/types/nullable.type';
import { DeepPartial } from 'src/utils/types/deep-partial.type';
import { User } from 'src/users/domain/user';

@Injectable()
export class AddressesService {
  private logger = new Logger(AddressesService.name);
  constructor(
    private readonly addressesRepository: AddressRepository,
    private readonly usersService: UsersService,
  ) {}

  async create(
    createAddressDto: CreateAddressDto,
    logedInUser?: User,
  ): Promise<Address> {
    const clonedPayload = {
      ...createAddressDto,
    };

    if (logedInUser) {
      clonedPayload.user = logedInUser;
      clonedPayload.createdBy = logedInUser;
      clonedPayload.updatedBy = logedInUser;
    }
    if (clonedPayload.email && logedInUser) {
      const emailObject = await this.addressesRepository.findOne(
        {
          email: clonedPayload.email,
        },
        logedInUser,
      );
      if (emailObject) {
        this.logger.error('emailAlreadyExists');
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              email: 'emailAlreadyExists',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    if (clonedPayload.address && logedInUser) {
      const addressObject = await this.addressesRepository.findOne(
        {
          address: clonedPayload.address,
        },
        logedInUser,
      );
      if (addressObject) {
        this.logger.error('addressAlreadyExists');
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              address: 'addressAlreadyExists',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    return this.addressesRepository.create(clonedPayload);
  }

  findManyWithPagination({
    sortOptions,
    paginationOptions,
    logedInUser,
  }: {
    sortOptions?: SortAddressDto[] | null;
    paginationOptions: IPaginationOptions;
    logedInUser: User;
  }): Promise<Address[]> {
    return this.addressesRepository.findManyWithPagination({
      sortOptions,
      paginationOptions,
      logedInUser,
    });
  }

  async findOne(
    fields: EntityCondition<Address>,
    logedInUser: User,
  ): Promise<NullableType<Address>> {
    console.log('fields', fields);
    return this.addressesRepository.findOne(fields, logedInUser);
  }

  async update(
    id: Address['id'],
    payload: DeepPartial<Address>,
    logedInUser?: User,
  ): Promise<Address | null> {
    const clonedPayload = { ...payload };

    if (logedInUser) {
      clonedPayload.user = logedInUser;
      clonedPayload.updatedBy = logedInUser;
    }

    return this.addressesRepository.update(id, clonedPayload);
  }

  async softDelete(id: Address['id']): Promise<void> {
    await this.addressesRepository.softDelete(id);
  }

  async checkUser(logedInUserId: string): Promise<User> {
    const logedInUser = await this.usersService.findOne({
      id: logedInUserId,
    });
    if (!logedInUser) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            logedInUserId: 'logedInUserDoenstExists',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return logedInUser;
  }
}
