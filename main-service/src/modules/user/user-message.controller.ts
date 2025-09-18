import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { USER_MESSAGE_PATTERNS } from 'shared-common';
import { UpdateUserDTO, ChangePasswordDTO } from './user.dto';

@Controller()
export class UserMessageController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(USER_MESSAGE_PATTERNS.FIND_BY_USERNAME)
  async findByUsernameMessage(@Payload() data: { username: string }) {
    return this.userService.findByUsername(data.username);
  }

  @MessagePattern(USER_MESSAGE_PATTERNS.FIND_BY_ID)
  async findByIdMessage(@Payload() data: { id: string }) {
    return this.userService.findById(data.id);
  }

  @MessagePattern(USER_MESSAGE_PATTERNS.FIND_BY_ID_WITH_PERMISSIONS)
  async findByIdWithPermissionsMessage(@Payload() data: { id: string }) {
    return this.userService.findByIdWithPermissions(data.id);
  }

  @MessagePattern(USER_MESSAGE_PATTERNS.UPDATE)
  async updateMessage(@Payload() data: { id: string; updateUserDto: UpdateUserDTO }) {
    return this.userService.updateUser(data.id, data.updateUserDto);
  }

  @MessagePattern(USER_MESSAGE_PATTERNS.UPDATE_LAST_LOGIN)
  async updateLastLoginMessage(@Payload() data: { id: string }) {
    return this.userService.updateLastLogin(data.id);
  }

  @MessagePattern(USER_MESSAGE_PATTERNS.CHANGE_PASSWORD)
  async changePasswordMessage(@Payload() data: { id: string; changePasswordDto: ChangePasswordDTO }) {
    return this.userService.changePassword(data.id, data.changePasswordDto);
  }
}
