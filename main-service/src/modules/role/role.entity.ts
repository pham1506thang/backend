import {
  Entity,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Permission } from './permission.entity';
import { BaseEntity } from 'shared-common';

@Entity('roles')
export class Role extends BaseEntity {
  @Column({ unique: true })
  code: string;

  @Column()
  label: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ default: false })
  isSuperAdmin: boolean;

  @Column({ default: false })
  isProtected: boolean;

  @ManyToMany(() => Permission)
  @JoinTable({ name: 'role_permissions' })
  permissions: Permission[];
}
