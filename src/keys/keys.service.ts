import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { AllConfigType } from 'src/config/config.type';
import { DeepPartial } from 'src/utils/types/deep-partial.type';
import { NullableType } from 'src/utils/types/nullable.type';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { KeyRepository } from './infrastructure/persistence/key.repository';
import { CreateKeyDto } from './dto/create-key.dto';
import { Key } from './domain/key';

@Injectable()
export class KeysService {
  private logger = new Logger(KeysService.name);
  private secretKey: Buffer;

  constructor(
    private configService: ConfigService<AllConfigType>,
    private keysRepository: KeyRepository,
  ) {
    const secretKeyFromConfig: string = this.configService.getOrThrow<string>(
      'mina.serverPrivateKey',
      { infer: true },
    );
    if (secretKeyFromConfig && secretKeyFromConfig.length >= 32) {
      this.secretKey = Buffer.from(secretKeyFromConfig.substring(0, 32));
    } else {
      this.logger.error('KeysService config is not set');
    }
  }

  async create(createKeyDto: CreateKeyDto): Promise<Key> {
    const clonedPayload = { ...createKeyDto };

    if (clonedPayload.key) {
      const encryptedKey = this.encryptKey(clonedPayload.key);
      clonedPayload.key = encryptedKey.toString();
    }
    const result = await this.keysRepository.create(clonedPayload);
    return result;
  }

  async findOne(fields: EntityCondition<Key>): Promise<NullableType<Key>> {
    const clonedResult = await this.keysRepository.findOne(fields);
    if (clonedResult && clonedResult.key) {
      const decryptedKey = this.decryptKey(clonedResult.key);
      clonedResult.key = decryptedKey.toString();
    }
    return clonedResult;
  }

  async update(id: Key['id'], payload: DeepPartial<Key>): Promise<Key | null> {
    const clonedPayload = { ...payload };
    if (clonedPayload.key) {
      const encryptedKey = this.encryptKey(clonedPayload.key);
      clonedPayload.key = encryptedKey.toString();
    }
    return this.keysRepository.update(id, clonedPayload);
  }

  async softDelete(id: Key['id']): Promise<void> {
    return this.keysRepository.softDelete(id);
  }

  private encryptKey(key: string): string {
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv('aes-256-cbc', this.secretKey, iv);
    let encrypted = cipher.update(key, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const encryptedData = iv.toString('hex') + encrypted;
    return encryptedData;
  }

  private decryptKey(encryptedKey: string): string {
    const iv = Buffer.from(encryptedKey.slice(0, 32), 'hex');
    const encryptedText = encryptedKey.slice(32);
    const decipher = crypto.createDecipheriv('aes-256-cbc', this.secretKey, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
