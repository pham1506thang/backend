import { Body, Controller, Get, Post, UseGuards, Patch, Param, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { CreateUserDTO, UpdateUserDTO, ChangePasswordDTO } from './user.dto';
import { RolePermission } from '../../common/decorators/role-permission.decorator';
import { Actions, Domains } from 'common/constants/permissions';
import { Types } from 'mongoose';
import { CurrentUser } from 'common/decorators/current-user.decorator';
import { JwtUser } from 'common/interfaces/jwt-user.interface';

@Controller(Domains.Users)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolePermission(Domains.Users, Actions.Create)
  createUser(@Body() createUserDto: CreateUserDTO) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolePermission(Domains.Users, Actions.Read)
  getUsers() {
    return this.userService.findAll();
  }

  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @CurrentUser() user: JwtUser,
    @Body() changePasswordDto: ChangePasswordDTO
  ) {
    await this.userService.changePassword(user._id, changePasswordDto);
    return { message: 'Password changed successfully' };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolePermission(Domains.Users, Actions.Update)
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDTO,
  ) {
    return this.userService.updateUser(
      new Types.ObjectId(id),
      updateUserDto,
    );
  }
}
