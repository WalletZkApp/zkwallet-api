import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindOptionsWhere, Repository } from 'typeorm';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { EntityCondition } from '../../../../../utils/types/entity-condition.type';
import { AddressEntity } from '../entities/address.entity';
import { Address } from 'src/addresses/domain/address';
import { AddressMapper } from '../mappers/address.mapper';
import { AddressRepository } from '../../address.repository';
import { SortAddressDto, UserDto } from 'src/addresses/dto/query-address.dto';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { User } from 'src/users/domain/user';

@Injectable()
export class AddressesRelationalRepository implements AddressRepository {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressesRepository: Repository<AddressEntity>,
  ) {}

  async create(data: Address): Promise<Address> {
    const persistenceModel = AddressMapper.toPersistence(data);
    console.log('persistenceModel', persistenceModel);
    const newEntity = await this.addressesRepository.save(
      this.addressesRepository.create(persistenceModel),
    );
    console.log('newEntity', newEntity);
    return AddressMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    sortOptions,
    paginationOptions,
    logedInUser,
  }: {
    sortOptions?: SortAddressDto[] | null;
    paginationOptions: IPaginationOptions;
    logedInUser: UserDto;
  }): Promise<Address[]> {
    const where: FindOptionsWhere<AddressEntity> = {};
    where.user = {
      id: logedInUser.id,
    };

    const entities = await this.addressesRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: where,
      order: sortOptions?.reduce(
        (accumulator, sort) => ({
          ...accumulator,
          [sort.orderBy]: sort.order,
        }),
        {},
      ),
    });

    return entities.map((address) => AddressMapper.toDomain(address));
  }

  async findOne(
    fields: EntityCondition<Address>,
    logedInUser: User,
  ): Promise<NullableType<Address>> {
    const where: FindOptionsWhere<AddressEntity> = {
      user: {
        id: logedInUser.id as string,
      },
      id: fields.id as string,
      name: fields.name as string,
      email: fields.email as string,
      address: fields.address as string,
    };

    const entity = await this.addressesRepository.findOne({
      where: where,
    });

    return entity ? AddressMapper.toDomain(entity) : null;
  }

  async update(id: Address['id'], payload: Partial<Address>): Promise<Address> {
    const entity = await this.addressesRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!entity) {
      throw new Error('Address not found');
    }

    const updatedEntity = await this.addressesRepository.save(
      this.addressesRepository.create(
        AddressMapper.toPersistence({
          ...AddressMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return AddressMapper.toDomain(updatedEntity);
  }

  async softDelete(id: Address['id']): Promise<void> {
    await this.addressesRepository.softDelete(id);
  }
}
