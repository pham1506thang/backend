import { Entity, Column, ManyToMany } from 'typeorm';
import { Role } from './role.entity';
import { BaseEntity, DomainType, ActionType } from 'shared-common';

@Entity('permissions')
export class Permission extends BaseEntity {
  @Column({ type: 'varchar' })
  domain: DomainType;

  @Column({ type: 'varchar' })
  action: ActionType;

  @ManyToMany(() => Role, role => role.permissions)
  roles: Role[];
}
