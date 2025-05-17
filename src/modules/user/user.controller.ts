import { Body, Controller, Get, Post, UseGuards, Patch, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RoleGuard } from '../role/role.guard';
import { CreateUserDTO, UpdateUserDTO } from './user.dto';
import { RolePermission } from '../role/role-permission.decorator';
import { Action, Domain } from 'common/constants/permissions';
import { Types } from 'mongoose';

@Controller(Domain.Users)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolePermission(Domain.Users, Action.Create)
  createUser(@Body() createUserDto: CreateUserDTO) {
    return this.userService.createUser(createUserDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolePermission(Domain.Users, Action.Update)
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDTO,
  ) {
    return this.userService.updateUser(
      new Types.ObjectId(id),
      updateUserDto,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolePermission(Domain.Users, Action.Read)
  getUsers() {
    return this.userService.findAll();
  }
}
