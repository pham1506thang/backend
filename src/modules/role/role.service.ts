import { Injectable, NotFoundException } from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { PermissionRepository } from './permission.repository';
import { CreateRoleDTO, UpdateRoleDTO } from './role.dto';
import _ from 'lodash';
import { ActionType, DomainType } from 'common/constants/permissions';
import { Permission } from './permission.entity';
import { SummaryRole } from './role.interface';
import { PaginationParamsDto } from 'common/dto/pagination-params.dto';

@Injectable()
export class RoleService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly permissionRepository: PermissionRepository,
  ) {}

  async findPaginatedRoles(params: PaginationParamsDto) {
    return this.roleRepository.findWithPagination({
      ...params,
      searchFields: ['code', 'label'],
    });
  }

  async findAllSummary(): Promise<SummaryRole[]> {
    const roles = await this.roleRepository.findAll();
    return roles.map((role) => ({
      id: role.id,
      code: role.code,
      label: role.label,
      description: role.description,
      isAdmin: role.isAdmin,
      isSuperAdmin: role.isSuperAdmin,
      isProtected: role.isProtected,
    }));
  }

  async findById(id: string) {
    return this.roleRepository.findById(id);
  }

  async findByIds(ids: string[]) {
    return this.roleRepository.findByIds(ids);
  }

  async hasPermission(
    roleIds: string[],
    domain: DomainType,
    action: ActionType,
  ): Promise<boolean> {
    if (roleIds.length === 0) return false;
    const roles = await this.findByIds(roleIds);
    if (roles.length !== roleIds.length) return false;
    if (roles.some((role) => role.isAdmin || role.isSuperAdmin)) return true;
    const permissions = roles.flatMap((role) => role.permissions || []);
    return permissions.some(
      (perm) => perm.domain === domain && perm.action === action,
    );
  }

  async create(dto: CreateRoleDTO) {
    let permissions: Permission[] = [];
    if (dto.permissions.length > 0) {
      permissions = await this.permissionRepository.findByIds(dto.permissions);
    }
    // Ensure isAdmin is false when creating through API
    return this.roleRepository.create({
      ...dto,
      isAdmin: false,
      permissions,
    });
  }

  async update(id: string, dto: UpdateRoleDTO) {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    let permissions: Permission[] = role.permissions;
    if (dto.permissions && dto.permissions.length > 0) {
      permissions = await this.permissionRepository.findByIds(dto.permissions);
    }
    return this.roleRepository.update(id, {
      ...dto,
      isAdmin: role.isAdmin,
      isSuperAdmin: role.isSuperAdmin,
      isProtected: role.isProtected,
      permissions,
    });
  }

  async remove(id: string) {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return this.roleRepository.softDeleteById(id);
  }
}
