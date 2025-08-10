import { Body, Controller, Get, Post, UseGuards, Patch, Param, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { CreateUserDTO, UpdateUserDTO, ChangePasswordDTO } from './user.dto';
import { RolePermission } from '../../common/decorators/role-permission.decorator';
import { DOMAINS } from 'common/constants/permissions';
import { CurrentUser } from 'common/decorators/current-user.decorator';
import { JwtUser } from 'common/interfaces/jwt-user.interface';
import { GrowthBookService } from 'modules/growthbook/growthbook.service';
import { ControllerFeatureGuard } from 'common/guards/controller-feature.guard';
import { ControllerFeature } from 'common/decorators/controller-feature.decorator';
import { PaginationParamsDto } from 'common/dto/pagination-params.dto';

@Controller(DOMAINS.USERS.value)
@UseGuards(ControllerFeatureGuard)
@ControllerFeature(DOMAINS.USERS.value)
export class UserController {
  constructor(private readonly userService: UserService, private readonly growthBookService: GrowthBookService) { }

  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolePermission(DOMAINS.USERS.value, DOMAINS.USERS.actions.VIEW_ALL)
  findPaginatedUsers(@Query() params: PaginationParamsDto) {
    return this.userService.findPaginatedUsers(params);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolePermission(DOMAINS.USERS.value, DOMAINS.USERS.actions.CREATE)
  createUser(@Body() createUserDto: CreateUserDTO) {
    return this.userService.createUser(createUserDto);
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
  @RolePermission(DOMAINS.USERS.value, DOMAINS.USERS.actions.EDIT_PROFILE)
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDTO,
  ) {
    return this.userService.updateUser(
      id,
      updateUserDto,
    );
  }
}
