import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './user.schema';
import { Types } from 'mongoose';
import { PaginationParamsDto } from 'common/dto/pagination-params.dto';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';
import { SALT_ROUNDS } from 'common/constants/config';
import { CreateUserDTO, UpdateUserDTO, ChangePasswordDTO } from './user.dto';

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
    return this.userRepository.updateById(id, dto);
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

  async findAll(params: PaginationParamsDto) {
    return this.userRepository.paginate(
      params,
      ['username', 'email', 'name'], // searchable fields
      {}, // base query
      { password: 0 }, // exclude password
      false, // don't include deleted
      'roles' // populate roles
    );
  }

  async changePassword(userId: Types.ObjectId, dto: ChangePasswordDTO) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = bcrypt.hashSync(dto.newPassword, SALT_ROUNDS);

    // Update password
    return this.userRepository.updateById(userId, {
      password: hashedPassword
    });
  }
}
