import { Address } from 'src/addresses/domain/address';
import { AddressEntity } from '../entities/address.entity';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';

export class AddressMapper {
  static toDomain(raw: AddressEntity): Address {
    const address = new Address();
    address.id = raw.id;
    address.user = raw.user;
    address.name = raw.name;
    address.email = raw.email;
    address.address = raw.address;
    address.createdAt = raw.createdAt;
    address.updatedAt = raw.updatedAt;
    address.deletedAt = raw.deletedAt;
    address.createdBy = raw.createdBy;
    address.updatedBy = raw.updatedBy;
    return address;
  }

  static toPersistence(address: Address): AddressEntity {
    let user: UserEntity | undefined = undefined;
    let createdByuser: UserEntity | undefined = undefined;
    let updatedByuser: UserEntity | undefined = undefined;

    if (address.createdBy) {
      createdByuser = new UserEntity();
      createdByuser.id = address.createdBy.id;
    }

    if (address.updatedBy) {
      updatedByuser = new UserEntity();
      updatedByuser.id = address.updatedBy.id;
    }

    if (address.user) {
      user = new UserEntity();
      user.id = address.user.id;
    }

    const addressEntity = new AddressEntity();
    if (address.id && typeof address.id === 'string') {
      addressEntity.id = address.id;
    }
    if (user) {
      addressEntity.user = user;
    }
    if (address.name && typeof address.name === 'string') {
      addressEntity.name = address.name;
    }
    if (address.email && typeof address.email === 'string') {
      addressEntity.email = address.email;
    }
    if (address.address && typeof address.address === 'string') {
      addressEntity.address = address.address;
    }

    addressEntity.createdAt = address.createdAt;
    addressEntity.updatedAt = address.updatedAt;
    addressEntity.deletedAt = address.deletedAt;
    addressEntity.createdBy = createdByuser;
    addressEntity.updatedBy = updatedByuser;
    return addressEntity;
  }
}
