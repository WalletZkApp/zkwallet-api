import { Address } from 'src/addresses/domain/address';
import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { EntityCondition } from '../../../utils/types/entity-condition.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { SortAddressDto } from 'src/addresses/dto/query-address.dto';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { User } from 'src/users/domain/user';

export abstract class AddressRepository {
  abstract create(
    data: Omit<Address, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<Address>;

  abstract findManyWithPagination({
    sortOptions,
    paginationOptions,
    logedInUser,
  }: {
    sortOptions?: SortAddressDto[] | null;
    paginationOptions: IPaginationOptions;
    logedInUser: User;
  }): Promise<Address[]>;

  abstract findOne(
    fields: EntityCondition<Address>,
    logedInUser: User,
  ): Promise<NullableType<Address>>;

  abstract update(
    id: Address['id'],
    payload: DeepPartial<Address>,
  ): Promise<Address | null>;

  abstract softDelete(id: Address['id']): Promise<void>;
}
