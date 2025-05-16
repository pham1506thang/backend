import { ConflictException, Injectable } from '@nestjs/common';
import { User } from './user.schema';
import { Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';
import { SALT_ROUNDS } from 'common/constants/config';
import { UpdateUserDTO } from './user.dto';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(username: string, password: string, roleIds: Types.ObjectId[]) {
    try {
      const newUser = await this.userRepository.create({
        username,
        password: bcrypt.hashSync(password, SALT_ROUNDS),
        roles: roleIds,
      });
      return await newUser.save();
    } catch (e) {
      if (e.code === 11000) {
        throw new ConflictException('Username đã tồn tại');
      }
      throw e;
    }
  }

  async updateUser(id: Types.ObjectId, dto: UpdateUserDTO) {
    return this.userRepository.updateById(id, {
      ...dto,
      roles: dto.roleIds
    });
  }

  async findByUsername(username: string) {
    return this.userRepository.findOne({ username }, undefined, false, true);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll(undefined, { password: 0 }, false, true);
  }
}
