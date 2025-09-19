import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO, UpdateUserDTO, ChangePasswordDTO } from './user.dto';
import { JwtAuthGuard, CurrentUser, JwtUser } from 'shared-common';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('username/:username')
  async findByUsername(@Param('username') username: string) {
    return this.userService.findByUsername(username);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDTO) {
    return this.userService.createUser(createUserDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDTO,
    @CurrentUser() user: JwtUser
  ) {
    // Only allow users to update their own profile
    if (user.id !== id) {
      throw new Error('Forbidden');
    }
    return this.userService.updateUser(id, updateUserDto);
  }

  @Patch(':id/last-login')
  async updateLastLogin(@Param('id') id: string) {
    return this.userService.updateLastLogin(id);
  }

  @Patch(':id/change-password')
  async changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDTO,
    @CurrentUser() user: JwtUser
  ) {
    // Only allow users to change their own password
    if (user.id !== id) {
      throw new Error('Forbidden');
    }
    return this.userService.changePassword(id, changePasswordDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    // Only allow users to delete their own account
    if (user.id !== id) {
      throw new Error('Forbidden');
    }
    return this.userService.deleteUser(id);
  }

}
