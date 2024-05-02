import { Key } from 'src/keys/domain/key';
import { KeyEntity } from '../entities/key.entity';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';

export class KeyMapper {
  static toDomain(raw: KeyEntity): Key {
    const key = new Key();
    key.id = raw.id;
    key.key = raw.key;
    key.createdAt = raw.createdAt;
    key.updatedAt = raw.updatedAt;
    key.deletedAt = raw.deletedAt;
    key.createdBy = raw.createdBy;
    key.updatedBy = raw.updatedBy;
    key.deletedBy = raw.deletedBy;
    return key;
  }

  static toPersistence(key: Key): KeyEntity {
    const user = new UserEntity();
    let createdByUser: UserEntity | undefined = undefined;
    let updatedByUser: UserEntity | undefined = undefined;
    let deletedByUser: UserEntity | undefined = undefined;

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

    const keyEntity = new KeyEntity();
    if (key.id && typeof key.id === 'string') {
      keyEntity.id = key.id;
    }
    keyEntity.key = key.key;
    keyEntity.createdAt = key.createdAt;
    keyEntity.updatedAt = key.updatedAt;
    keyEntity.deletedAt = key.deletedAt;
    keyEntity.createdBy = createdByUser;
    keyEntity.updatedBy = updatedByUser;
    keyEntity.deletedBy = deletedByUser;
    return keyEntity;
  }
}
