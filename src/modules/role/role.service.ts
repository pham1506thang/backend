import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { RoleRepository } from './role.repository';
import { CreateRoleDTO, UpdateRoleDTO } from './role.dto';
import _ from 'lodash';
import { Action, Domain } from 'common/constants/permissions';

@Injectable()
export class RoleService {
  constructor(
    private readonly roleRepository: RoleRepository,
  ) {}

  async findById(id: Types.ObjectId) {
    return this.roleRepository.findById(id);
  }

  async findByIds(ids: Types.ObjectId[]) {
    return this.roleRepository.find({ _id: { $in: ids } });
  }

  async hasPermission(
    roleIds: Types.ObjectId[],
    domain: Domain,
    action: Action,
  ): Promise<boolean> {
    // If no roles, deny access
    if (roleIds.length === 0) return false;

    // Get all roles
    const roles = await this.findByIds(roleIds);
    
    // If any role is not found, deny access
    if (roles.length !== roleIds.length) return false;

    // Check if any role is admin
    if (roles.some(role => role.isAdmin)) return true;

    // Check if any role has the specific permission
    return roles.some(role =>
      role.permissions.some(
        permission =>
          permission.domain === domain &&
          permission.actions.some((_action) => _action === action)
      )
    );
  }

  async create(dto: CreateRoleDTO) {
    // Ensure isAdmin is false when creating through API
    return this.roleRepository.create({
      ...dto,
      isAdmin: false,
      permissions: dto.permissions || []
    });
  }

  async update(id: string, dto: UpdateRoleDTO) {
    const role = await this.roleRepository.findById(new Types.ObjectId(id));
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Ensure we can't modify isAdmin status through API
    return this.roleRepository.updateById(
      new Types.ObjectId(id),
      {
        ...dto,
        isAdmin: role.isAdmin, // Preserve existing isAdmin status
        isProtected: role.isProtected // Preserve existing isProtected status
      }
    );
  }

  async remove(id: string) {
    const role = await this.roleRepository.findById(new Types.ObjectId(id));
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return this.roleRepository.softDeleteById(new Types.ObjectId(id));
  }
}
