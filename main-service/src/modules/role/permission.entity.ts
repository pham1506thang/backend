import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Role } from './role.entity';
import { IBaseEntity, DomainType, ActionType } from 'shared-common';

@Entity('permissions')
export class Permission implements IBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  domain: DomainType;

  @Column({ type: 'varchar' })
  action: ActionType;

  @ManyToMany(() => Role, role => role.permissions)
  roles: Role[];
}
