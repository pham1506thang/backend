import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDTO, UpdateRoleDTO, AssignPermissionDTO } from './role.dto';
import { DOMAINS } from 'shared-common';
import {
  RolePermission,
  JwtAuthGuard,
  PaginationParamsDto,
  GatewayRoleGuard,
} from 'shared-common';
import { AdminRoleGuard } from '../../common/guards/admin-role.guard';
import { ProtectedRoleGuard } from '../../common/guards/protected-role.guard';

@Controller(DOMAINS.ROLES.value)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @UseGuards(JwtAuthGuard, GatewayRoleGuard)
  @RolePermission(DOMAINS.ROLES.value, DOMAINS.ROLES.actions.VIEW)
  findPaginatedRoles(@Query() params: PaginationParamsDto) {
    return this.roleService.findPaginatedRoles(params);
  }

  @Get('summary')
  @UseGuards(JwtAuthGuard)
  findAllSummary() {
    return this.roleService.findAllSummary();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, GatewayRoleGuard)
  @RolePermission(DOMAINS.ROLES.value, DOMAINS.ROLES.actions.VIEW)
  async getRoleById(@Param('id') id: string) {
    return this.roleService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, GatewayRoleGuard, AdminRoleGuard)
  @RolePermission(DOMAINS.ROLES.value, DOMAINS.ROLES.actions.CREATE)
  create(@Body() body: CreateRoleDTO) {
    return this.roleService.create(body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, GatewayRoleGuard, AdminRoleGuard, ProtectedRoleGuard)
  @RolePermission(DOMAINS.ROLES.value, DOMAINS.ROLES.actions.EDIT)
  update(@Param('id') id: string, @Body() body: UpdateRoleDTO) {
    return this.roleService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, GatewayRoleGuard, ProtectedRoleGuard)
  @RolePermission(DOMAINS.ROLES.value, DOMAINS.ROLES.actions.DELETE)
  remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }

  @Patch(':id/assign-permissions')
  @UseGuards(JwtAuthGuard, GatewayRoleGuard, AdminRoleGuard)
  @RolePermission(DOMAINS.ROLES.value, DOMAINS.ROLES.actions.ASSIGN_PERMISSION)
  assignPermissions(@Param('id') id: string, @Body() body: AssignPermissionDTO) {
    return this.roleService.assignPermissions(id, body);
  }
}
