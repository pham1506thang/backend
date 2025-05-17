import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'common/repositories/base.repository';
import { User, UserDocument } from './user.schema';
import { Types } from 'mongoose';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super(userModel);
  }

  async findByUsername(username: string, includeDeleted = false): Promise<User | null> {
    const filter = includeDeleted ? { username } : { username, isDeleted: false };
    return this.userModel.findOne(filter).exec();
  }

  async findOneWithRoles(username: string, includeDeleted = false): Promise<User | null> {
    const filter = includeDeleted ? { username } : { username, isDeleted: false };
    return this.userModel
      .findOne(filter)
      .populate('roles')
      .exec();
  }

  async findAllWithRoles(includeDeleted = false): Promise<User[]> {
    const filter = includeDeleted ? {} : { isDeleted: false };
    return this.userModel
      .find(filter)
      .select('-password')  // Exclude password field
      .populate('roles')
      .exec();
  }

  async updateLastLoginOnly(id: Types.ObjectId): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(
        id,
        { lastLogin: new Date() },
        { 
          new: true,
          timestamps: false // This prevents updating the updatedAt field
        }
      )
      .exec();
  }

  async findByEmail(
    email: string,
    includeDeleted = false,
  ): Promise<User | null> {
    return this.findOne({ email }, undefined, includeDeleted, true);
  }
}
