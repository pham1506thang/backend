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
  AssignUserRolesDTO,
} from './user.dto';
import { USER_STATUS } from './user-status.constant';

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

  async findByIdWithPermissions(id: string) {
    return this.userRepository.findByIdWithPermissions(id);
  }

  async createUser(dto: CreateUserDTO): Promise<User> {
    try {
      const hashedPassword = bcrypt.hashSync(dto.password, SALT_ROUNDS);
      const { roles, ...rest } = dto;
      const userData: Partial<User> = {
        ...rest,
        password: hashedPassword,
        status: USER_STATUS.PENDING,
      };
      if (roles && roles.length > 0) {
        const foundRoles = await this.roleRepository.findByIds(roles);
        if (foundRoles.length !== roles.length) {
          const invalidRoles = roles.filter(
            (roleId) =>
              !foundRoles.some((foundRole) => foundRole.id === roleId),
          );
          throw new BadRequestException({
            message: 'Một hoặc nhiều role không hợp lệ',
            details: { invalidRoles },
          });
        }
        userData.roles = foundRoles;
      }
      return await this.userRepository.create(userData);
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException({
          message: 'Username already exists',
          details: { username: ['Username already exists'] },
        });
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
    dto: AssignUserRolesDTO,
  ): Promise<User | null> {
    // Find the user first
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UnauthorizedException('Không tìm thấy người dùng');
    }

    if (!dto.roles || dto.roles.length === 0) {
      user.roles = [];
    } else {
      const foundRoles = await this.roleRepository.findByIds(dto.roles);
      if (foundRoles.length !== dto.roles.length) {
        throw new BadRequestException({
          message: 'Một hoặc nhiều role không hợp lệ',
          details: { roles: ['Một hoặc nhiều role không hợp lệ'] },
        });
      }
      user.roles = foundRoles;
    }
    
    // Save the user with updated roles
    await this.userRepository.save(user);
    return user;
  }

  async updateLastLogin(id: string) {
    return this.userRepository.updateLastLogin(id);
  }

  async changePassword(userId: string, dto: ChangePasswordDTO) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Không tìm thấy người dùng');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      dto.currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException({
        message: 'Mật khẩu hiện tại không đúng',
        details: { currentPassword: ['Mật khẩu hiện tại không đúng'] },
      });
    }

    // Hash new password
    const hashedPassword = bcrypt.hashSync(dto.newPassword, SALT_ROUNDS);

    // Update password
    await this.userRepository.update(userId, {
      password: hashedPassword,
    });
  }
}
