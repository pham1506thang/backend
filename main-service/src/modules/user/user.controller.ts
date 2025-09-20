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
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO, UpdateUserDTO, ChangePasswordDTO, AssignUserRolesDTO } from './user.dto';
import { JwtAuthGuard, RolePermission, DOMAINS, PaginationParamsDto, GatewayRoleGuard } from 'shared-common';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard, GatewayRoleGuard)
  @RolePermission(DOMAINS.USERS.value, DOMAINS.USERS.actions.VIEW)
  findPaginatedUsers(@Query() params: PaginationParamsDto) {
    return this.userService.findPaginatedUsers(params);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, GatewayRoleGuard)
  @RolePermission(DOMAINS.USERS.value, DOMAINS.USERS.actions.VIEW)
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  @Post()
  @UseGuards(JwtAuthGuard, GatewayRoleGuard)
  @RolePermission(DOMAINS.USERS.value, DOMAINS.USERS.actions.CREATE)
  createUser(@Body() createUserDto: CreateUserDTO) {
    return this.userService.createUser(createUserDto);
  }

  @Patch(':id/change-password')
  @UseGuards(JwtAuthGuard)
  @RolePermission(DOMAINS.USERS.value, DOMAINS.USERS.actions.CHANGE_PASSWORD)
  async changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDTO
  ) {
    await this.userService.changePassword(id, changePasswordDto);
    return { message: 'Password changed successfully' };
  }

  @Patch(':id/assign-roles')
  @UseGuards(JwtAuthGuard)
  @RolePermission(DOMAINS.USERS.value, DOMAINS.USERS.actions.ASSIGN_ROLE)
  async assignUserRoles(
    @Param('id') id: string,
    @Body() assignUserRolesDto: AssignUserRolesDTO
  ) {
    await this.userService.updateUserRoles(id, assignUserRolesDto);
    return { message: 'Assign roles successfully' };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, GatewayRoleGuard)
  @RolePermission(DOMAINS.USERS.value, DOMAINS.USERS.actions.EDIT)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDTO
  ) {
    await this.userService.updateUser(id, updateUserDto);
    return { message: 'Update user successfully' };
  }
}
