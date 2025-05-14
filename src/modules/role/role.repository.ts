import { Injectable, NotFoundException } from '@nestjs/common';
import { FilterQuery, Model, Types } from 'mongoose';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { Role, RoleDocument } from './role.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Domain } from './domain/domain.schema';
import { Action } from './action/action.schema';

@Injectable()
export class RoleRepository extends BaseRepository<RoleDocument> {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
  ) {
    super(roleModel);
  }

  async findByIdAndPopulatePermissions(
    _id: Types.ObjectId,
    includeDeleted?: boolean,
  ) {
    const filter: FilterQuery<RoleDocument> = includeDeleted
      ? { _id: _id }
      : { _id: _id, isDeleted: false };
    const role = await this.roleModel
      .findOne(filter)
      .populate('permissions.domain')
      .populate('permissions.actions')
      .lean()
      .exec();
    if (!role) {
      throw new NotFoundException(`Document with id ${_id} not found.`);
    }
    return role as unknown as Omit<Role, 'permissions'> & {
      permissions: { domain: Domain; actions: Action[] }[];
    };
  }
}
