import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { FindOptionsWhere, Repository } from 'typeorm';
import { KeyEntity } from '../entities/key.entity';
import { Key } from 'src/keys/domain/key';
import { KeyMapper } from '../mappers/key.mapper';
import { KeyRepository } from '../../key.repository';
import { NullableType } from 'src/utils/types/nullable.type';

@Injectable()
export class KeysRelationalRepository implements KeyRepository {
  constructor(
    @InjectRepository(KeyEntity)
    private readonly keysRepository: Repository<KeyEntity>,
  ) {}

  async create(data: Key): Promise<Key> {
    const persistenceModel = KeyMapper.toPersistence(data);
    const newEntity = await this.keysRepository.save(
      this.keysRepository.create(persistenceModel),
    );
    return KeyMapper.toDomain(newEntity);
  }

  async findOne(fields: EntityCondition<Key>): Promise<NullableType<Key>> {
    const entity = await this.keysRepository.findOne({
      where: fields as FindOptionsWhere<KeyEntity>,
    });

    return entity ? KeyMapper.toDomain(entity) : null;
  }

  async update(id: Key['id'], payload: Partial<Key>): Promise<Key> {
    const entity = await this.keysRepository.findOne({
      where: { id: id.toString() },
    });

    if (!entity) {
      throw new Error('Key not found');
    }

    const updatedEntity = await this.keysRepository.save(
      this.keysRepository.create(
        KeyMapper.toPersistence({
          ...KeyMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return KeyMapper.toDomain(updatedEntity);
  }

  async softDelete(id: Key['id']): Promise<void> {
    await this.keysRepository.softDelete(id);
  }
}
