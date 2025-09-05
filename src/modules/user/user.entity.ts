import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Role } from '../role/role.entity';
import { IBaseEntity } from 'common/interfaces/base-entity.interface';
import { USER_STATUS } from './user-status.constant';

@Entity('users')
export class User implements IBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({
    type: 'enum',
    enum: USER_STATUS,
    default: USER_STATUS.PENDING,
  })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  lastLogin?: Date;

  @ManyToMany(() => Role)
  @JoinTable({ name: 'user_roles' })
  roles: Role[];

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
