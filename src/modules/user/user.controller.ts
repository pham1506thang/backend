import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Patch,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import {
  CreateUserDTO,
  UpdateUserDTO,
  ChangePasswordDTO,
  AssignUserRolesDTO,
} from './user.dto';
import { RolePermission } from '../../common/decorators/role-permission.decorator';
import { DOMAINS } from 'common/constants/permissions';
import { GrowthBookService } from 'modules/growthbook/growthbook.service';
import { ControllerFeatureGuard } from 'common/guards/controller-feature.guard';
import { ControllerFeature } from 'common/decorators/controller-feature.decorator';
import { PaginationParamsDto } from 'common/dto/pagination-params.dto';

@Controller(DOMAINS.USERS.value)
@UseGuards(ControllerFeatureGuard)
@ControllerFeature(DOMAINS.USERS.value)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly growthBookService: GrowthBookService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolePermission(DOMAINS.USERS.value, DOMAINS.USERS.actions.VIEW)
  findPaginatedUsers(@Query() params: PaginationParamsDto) {
    return this.userService.findPaginatedUsers(params);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolePermission(DOMAINS.USERS.value, DOMAINS.USERS.actions.VIEW)
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return user;
  }

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolePermission(DOMAINS.USERS.value, DOMAINS.USERS.actions.CREATE)
  createUser(@Body() createUserDto: CreateUserDTO) {
    return this.userService.createUser(createUserDto);
  }

  @Patch(':id/change-password')
  @UseGuards(JwtAuthGuard)
  @RolePermission(DOMAINS.USERS.value, DOMAINS.USERS.actions.CHANGE_PASSWORD)
  async changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDTO,
  ) {
    await this.userService.changePassword(id, changePasswordDto);
    return { message: 'Password changed successfully' };
  }

  @Patch(':id/assign-roles')
  @UseGuards(JwtAuthGuard)
  @RolePermission(DOMAINS.USERS.value, DOMAINS.USERS.actions.ASSIGN_ROLE)
  async assignUserRoles(
    @Param('id') id: string,
    @Body() assignUserRolesDto: AssignUserRolesDTO,
  ) {
    await this.userService.updateUserRoles(id, assignUserRolesDto);
    return { message: 'Assign roles successfully' };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolePermission(DOMAINS.USERS.value, DOMAINS.USERS.actions.EDIT)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDTO,
  ) {
    await this.userService.updateUser(id, updateUserDto);
    return { message: 'Update user successfully' };
  }
}
