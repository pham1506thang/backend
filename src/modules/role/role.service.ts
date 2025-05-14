import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { RoleRepository } from './role.repository';
import { CreateRoleDTO } from './role.dto';
import _ from 'lodash';
import { DomainRepository } from './domain/domain.repository';
import { ActionRepository } from './action/action.repository';

@Injectable()
export class RoleService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly domainRepository: DomainRepository,
    private readonly actionRepository: ActionRepository,
  ) {}

  async hasPermission(
    roleId: Types.ObjectId,
    domainCode: string,
    actionCode: string,
  ): Promise<boolean> {
    const role =
      await this.roleRepository.findByIdAndPopulatePermissions(roleId);
    if (!role) return false;
    return role.permissions.some(
      (permission) =>
        permission.domain.code === domainCode &&
        permission.actions.some((action) => action.code === actionCode),
    );
  }

  async create(dto: CreateRoleDTO) {
    const domainIds = _.chain(dto.permissions)
      .map((p) => p.domain)
      .uniq()
      .value();
    const actionIds = _.chain(dto.permissions)
      .map((p) => p.actions)
      .flatten()
      .uniq()
      .value();
    await Promise.all([
      this.domainRepository.validateObjectIds(domainIds),
      this.actionRepository.validateObjectIds(actionIds),
    ]);
    return this.roleRepository.create(dto);
  }
}
