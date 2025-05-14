import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super(userModel);
  }

  async findByEmail(
    email: string,
    includeDeleted = false,
  ): Promise<User | null> {
    return this.findOne({ email }, includeDeleted);
  }
}
