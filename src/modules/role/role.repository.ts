import { Injectable } from '@nestjs/common';
import { Model, FilterQuery } from 'mongoose';
import { BaseRepository } from 'common/repositories/base.repository';
import { Role, RoleDocument } from './role.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class RoleRepository extends BaseRepository<RoleDocument> {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
  ) {
    super(roleModel);
  }

  async find(filter: FilterQuery<RoleDocument>): Promise<RoleDocument[]> {
    return this.roleModel.find(filter).exec();
  }
}
