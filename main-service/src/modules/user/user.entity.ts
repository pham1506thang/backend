import {
  Entity,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Role } from '../role/role.entity';
import { BaseEntity } from 'shared-common';
import { USER_STATUS } from './user-status.constant';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({
    type: 'enum',
    enum: USER_STATUS,
    default: USER_STATUS.PENDING,
  })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastActiveAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  emailVerifiedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  passwordChangedAt?: Date;

  @Column({ nullable: true })
  avatarUrl?: string;

  @Column({ nullable: true })
  thumbnailAvatarUrl?: string;

  @ManyToMany(() => Role)
  @JoinTable({ name: 'user_roles' })
  roles: Role[];

  @Column({ default: false })
  isDeleted: boolean;
}
