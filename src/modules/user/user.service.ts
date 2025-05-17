import { ConflictException, Injectable } from '@nestjs/common';
import { User } from './user.schema';
import { Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';
import { SALT_ROUNDS } from 'common/constants/config';
import { CreateUserDTO, UpdateUserDTO } from './user.dto';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(dto: CreateUserDTO) {
    try {
      const hashedPassword = bcrypt.hashSync(dto.password, SALT_ROUNDS);
      const newUser = await this.userRepository.create({
        ...dto,
        password: hashedPassword,
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

  async updateLastLogin(id: Types.ObjectId) {
    return this.userRepository.updateLastLoginOnly(id);
  }

  async findByUsername(username: string) {
    return this.userRepository.findByUsername(username);
  }

  async findByUsernameWithRoles(username: string) {
    return this.userRepository.findOneWithRoles(username);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.findAllWithRoles();
  }
}
