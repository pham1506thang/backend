import { Body, Controller, Post, UseGuards, Patch, Param, Delete } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDTO, UpdateRoleDTO } from './role.dto';
import { Action, Domain } from 'common/constants/permissions';
import { RoleGuard } from './role.guard';
import { RolePermission } from './role-permission.decorator';
import { JwtAuthGuard } from 'modules/auth/auth.guard';
import { ProtectedRoleGuard } from './protected-role.guard';
import { AdminRoleGuard } from './admin-role.guard';

@Controller(Domain.Roles)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard, AdminRoleGuard)
  @RolePermission(Domain.Roles, Action.Create)
  create(@Body() body: CreateRoleDTO) {
    return this.roleService.create(body);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleGuard, AdminRoleGuard, ProtectedRoleGuard)
  @RolePermission(Domain.Roles, Action.Update)
  update(@Param('id') id: string, @Body() body: UpdateRoleDTO) {
    return this.roleService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard, ProtectedRoleGuard)
  @RolePermission(Domain.Roles, Action.Delete)
  remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }
}
