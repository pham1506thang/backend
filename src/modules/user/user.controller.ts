import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RoleGuard } from '../role/role.guard';
import { RolePermission } from '../role/role-permission.decorator';
import { Types } from 'mongoose';

@Controller('users')
// @UseGuards(JwtAuthGuard, RoleGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  // @RolePermission("user", "create")
  createUser(
    @Body() body: { username: string; password: string; roleId: string },
  ) {
    return this.userService.createUser(
      body.username,
      body.password,
      new Types.ObjectId(body.roleId),
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolePermission('user', 'update')
  getUsers() {
    return this.userService.findAll();
  }
}
