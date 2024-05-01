import { NullableType } from 'src/utils/types/nullable.type';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { DeepPartial } from 'src/utils/types/deep-partial.type';
import { Key } from '../../domain/key';

export abstract class KeyRepository {
  abstract create(
    data: Omit<Key, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<Key>;

  abstract findOne(fields: EntityCondition<Key>): Promise<NullableType<Key>>;

  abstract update(
    id: Key['id'],
    payload: DeepPartial<Key>,
  ): Promise<Key | null>;

  abstract softDelete(id: Key['id']): Promise<void>;
}
