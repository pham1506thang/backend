import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
const saltRounds = 10;
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(username: string, password: string, roleId: Types.ObjectId) {
    try {
      const newUser = new this.userModel({
        username,
        password: bcrypt.hashSync(password, 10),
        role: roleId,
      });
      return await newUser.save();
    } catch (e) {
      if (e.code === 11000) {
        throw new ConflictException('Username đã tồn tại');
      }
      throw e;
    }
  }

  async findByUsername(username: string) {
    return this.userModel.findOne({ username }).lean();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
