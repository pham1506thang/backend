import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './user.entity';
import { PaginationParamsDto } from 'common/dto/pagination-params.dto';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';
import { RoleRepository } from '../role/role.repository';
import { SALT_ROUNDS } from 'common/constants/config';
import {
  CreateUserDTO,
  UpdateUserDTO,
  ChangePasswordDTO,
  UpdateUserRolesDTO,
} from './user.dto';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private roleRepository: RoleRepository,
  ) {}

  async findPaginatedUsers(params: PaginationParamsDto) {
    return this.userRepository.findWithPagination({
      ...params,
      searchFields: ['username', 'name', 'email'],
    });
  }

  async findByUsername(username: string) {
    return this.userRepository.findByUsername(username);
  }

  async findById(id: string) {
    return this.userRepository.findById(id);
  }

  async createUser(dto: CreateUserDTO): Promise<User> {
    try {
      const hashedPassword = bcrypt.hashSync(dto.password, SALT_ROUNDS);
      const { roles, ...rest } = dto;
      const userData: Partial<User> = {
        ...rest,
        password: hashedPassword,
      };
      if (roles && roles.length > 0) {
        const foundRoles = await this.roleRepository.findByIds(roles);
        if (foundRoles.length !== roles.length) {
          throw new BadRequestException('Một hoặc nhiều role không hợp lệ');
        }
        userData.roles = foundRoles;
      }
      return await this.userRepository.create(userData);
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException('Username đã tồn tại');
      }
      throw e;
    }
  }

  async updateUser(id: string, dto: UpdateUserDTO): Promise<User | null> {
    await this.userRepository.update(id, dto);
    return this.userRepository.findById(id);
  }

  async updateUserRoles(
    id: string,
    dto: UpdateUserRolesDTO,
  ): Promise<User | null> {
    if (!dto.roles || dto.roles.length === 0) {
      await this.userRepository.update(id, { roles: [] });
      return this.userRepository.findById(id);
    }
    const foundRoles = await this.roleRepository.findByIds(dto.roles);
    if (foundRoles.length !== dto.roles.length) {
      throw new BadRequestException('Một hoặc nhiều role không hợp lệ');
    }
    await this.userRepository.update(id, { roles: foundRoles });
    return this.userRepository.findById(id);
  }

  async updateLastLogin(id: string) {
    return this.userRepository.updateLastLogin(id);
  }

  async changePassword(userId: string, dto: ChangePasswordDTO) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      dto.currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = bcrypt.hashSync(dto.newPassword, SALT_ROUNDS);

    // Update password
    await this.userRepository.update(userId, {
      password: hashedPassword,
    });
  }
}
