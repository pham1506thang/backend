import { Injectable, NotFoundException } from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { PermissionRepository } from './permission.repository';
import { CreateRoleDTO, UpdateRoleDTO, AssignPermissionDTO } from './role.dto';
import _ from 'lodash';
import { ActionType, DomainType } from 'shared-common'; 
import { SummaryRole } from './role.interface';
import {
  PaginationParamsDto,
} from 'shared-common';

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
    return roles.map(role => ({
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
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new NotFoundException({
        message: 'Không tìm thấy vai trò',
        details: { id: ['Không tìm thấy vai trò'] },
      });
    }
    return role;
  }

  async findByIds(ids: string[]) {
    return this.roleRepository.findByIds(ids);
  }

  async hasPermission(
    roleIds: string[],
    domain: DomainType,
    action: ActionType
  ): Promise<boolean> {
    if (roleIds.length === 0) return false;
    const roles = await this.findByIds(roleIds);
    if (roles.length !== roleIds.length) return false;
    if (roles.some(role => role.isAdmin || role.isSuperAdmin)) return true;
    const permissions = roles.flatMap(role => role.permissions || []);
    return permissions.some(
      perm => perm.domain === domain && perm.action === action
    );
  }

  async create(dto: CreateRoleDTO) {
    // Ensure isAdmin is false when creating through API
    const role = await this.roleRepository.create({
      ...dto,
      isAdmin: false,
      permissions: [],
    });
    
    return role;
  }

  async update(id: string, dto: UpdateRoleDTO) {
    const role = await this.findById(id);
    const updatedRole = await this.roleRepository.update(id, {
      ...dto,
      isAdmin: role.isAdmin,
      isSuperAdmin: role.isSuperAdmin,
      isProtected: role.isProtected,
    });
    
    return updatedRole;
  }

  async remove(id: string) {
    const role = await this.findById(id);

    const result = await this.roleRepository.softDeleteById(id);
    
    return result;
  }

  async assignPermissions(id: string, dto: AssignPermissionDTO) {
    const role = await this.findById(id);
    const permissions = await this.permissionRepository.findByIds(dto.permissions);
    const updatedRole = await this.roleRepository.update(id, {
      permissions,
      isAdmin: role.isAdmin,
      isSuperAdmin: role.isSuperAdmin,
      isProtected: role.isProtected,
    });
    
    return updatedRole;
  }
}
