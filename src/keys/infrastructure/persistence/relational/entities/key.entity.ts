import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { EntityRelationalHelper } from 'src/utils/relational-entity-helper';
import { Key } from 'src/keys/domain/key';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';

@Entity({
  name: 'key',
})
export class KeyEntity extends EntityRelationalHelper implements Key {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Expose({ groups: ['me', 'admin'] })
  @Column({ nullable: false })
  @Exclude({ toPlainOnly: true })
  key: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => UserEntity)
  createdBy?: UserEntity | null;

  @ManyToOne(() => UserEntity)
  updatedBy?: UserEntity | null;

  @ManyToOne(() => UserEntity)
  deletedBy?: UserEntity | null;
}
