import { KeyEntity } from 'src/keys/infrastructure/persistence/relational/entities/key.entity';
import { FileEntity } from '../../../../../files/infrastructure/persistence/relational/entities/file.entity';
import { FileMapper } from '../../../../../files/infrastructure/persistence/relational/mappers/file.mapper';
import { RoleEntity } from '../../../../../roles/infrastructure/persistence/relational/entities/role.entity';
import { StatusEntity } from '../../../../../statuses/infrastructure/persistence/relational/entities/status.entity';
import { User } from '../../../../domain/user';
import { UserEntity } from '../entities/user.entity';

export class UserMapper {
  static toDomain(raw: UserEntity): User {
    const user = new User();
    user.id = raw.id;
    user.username = raw.username;
    user.email = raw.email;
    user.zkAppAddress = raw.zkAppAddress;
    user.minaAddress = raw.minaAddress;
    user.password = raw.password;
    user.previousPassword = raw.previousPassword;
    user.key = raw.key;
    user.otpKey = raw.otpKey;
    user.provider = raw.provider;
    user.socialId = raw.socialId;
    user.firstName = raw.firstName;
    user.lastName = raw.lastName;
    if (raw.photo) {
      user.photo = FileMapper.toDomain(raw.photo);
    }
    user.role = raw.role;
    user.status = raw.status;
    user.createdAt = raw.createdAt;
    user.updatedAt = raw.updatedAt;
    user.deletedAt = raw.deletedAt;
    user.createdBy = raw.createdBy;
    user.updatedBy = raw.updatedBy;
    user.deletedBy = raw.deletedBy;
    return user;
  }

  static toPersistence(user: User): UserEntity {
    let role: RoleEntity | undefined = undefined;
    let createdByUser: UserEntity | undefined = undefined;
    let updatedByUser: UserEntity | undefined = undefined;
    let deletedByUser: UserEntity | undefined = undefined;
    let privateKey: KeyEntity | undefined = undefined;
    let otpKey: KeyEntity | undefined = undefined;

    if (user.createdBy) {
      createdByUser = new UserEntity();
      createdByUser.id = user.createdBy.id;
    }

    if (user.updatedBy) {
      updatedByUser = new UserEntity();
      updatedByUser.id = user.updatedBy.id;
    }

    if (user.deletedBy) {
      deletedByUser = new UserEntity();
      deletedByUser.id = user.deletedBy.id;
    }

    if (user.role) {
      role = new RoleEntity();
      role.id = user.role.id;
    }

    let photo: FileEntity | undefined | null = undefined;

    if (user.photo) {
      photo = new FileEntity();
      photo.id = user.photo.id;
      photo.path = user.photo.path;
    } else if (user.photo === null) {
      photo = null;
    }

    let status: StatusEntity | undefined = undefined;

    if (user.status) {
      status = new StatusEntity();
      status.id = user.status.id;
    }

    if (user.key) {
      privateKey = new KeyEntity();
      privateKey.id = user.key?.id;
    }

    if (user.otpKey) {
      otpKey = new KeyEntity();
      otpKey.id = user.otpKey?.id;
    }

    const userEntity = new UserEntity();
    if (user.id && typeof user.id === 'string') {
      userEntity.id = user.id;
    }
    userEntity.username = user.username;
    userEntity.email = user.email;
    if (user.zkAppAddress && typeof user.zkAppAddress === 'string') {
      userEntity.zkAppAddress = user.zkAppAddress;
    }
    if (user.minaAddress && typeof user.minaAddress === 'string') {
      userEntity.minaAddress = user.minaAddress;
    }
    userEntity.password = user.password;
    userEntity.previousPassword = user.previousPassword;
    userEntity.key = privateKey;
    userEntity.otpKey = otpKey;
    userEntity.provider = user.provider;
    userEntity.socialId = user.socialId;
    userEntity.firstName = user.firstName;
    userEntity.lastName = user.lastName;
    userEntity.photo = photo;
    userEntity.role = role;
    userEntity.status = status;
    userEntity.createdAt = user.createdAt;
    userEntity.updatedAt = user.updatedAt;
    userEntity.deletedAt = user.deletedAt;
    userEntity.createdBy = createdByUser;
    userEntity.updatedBy = updatedByUser;
    userEntity.deletedBy = user.deletedBy;
    return userEntity;
  }
}
