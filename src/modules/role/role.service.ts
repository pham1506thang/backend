import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Role, RoleDocument } from './role.schema';
import { DomainDocument } from '../domain/domain.schema';
import { ActionDocument } from '../action/action.schema';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}

  async hasPermission(
    roleId: Types.ObjectId,
    domainName: string,
    actionName: string,
  ): Promise<boolean> {
    const role = await this.roleModel
      .findById(roleId)
      .populate<{ domain: DomainDocument }>({ path: 'permissions.domain', select: 'name' })
      .populate<{ actions: ActionDocument[] }>({ path: 'permissions.actions', select: 'name' });
    if (!role) return false;
    const permissions = role.permissions as any[];
    return permissions.some(
      (permission) =>
        permission.domain.name === domainName &&
        permission.actions.some((action) => action.name === actionName),
    );
  }

  async create(domainId: Types.ObjectId, actionId: Types.ObjectId) {
    const newRole = new this.roleModel({ code: "admin", label: "admin", weight: 1, permissions: [{ domain: domainId, actions: [domainId]}]})
    return newRole.save()
  }
}
