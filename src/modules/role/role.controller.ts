import { Body, Controller, Post, UseGuards, Patch, Param, Delete } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDTO, UpdateRoleDTO } from './role.dto';
import { Action, Domain } from 'common/constants/permissions';
import { RoleGuard } from '../../common/guards/role.guard';
import { RolePermission } from '../../common/decorators/role-permission.decorator';
import { JwtAuthGuard } from 'common/guards/auth.guard';
import { ProtectedRoleGuard } from '../../common/guards/protected-role.guard';
import { AdminRoleGuard } from '../../common/guards/admin-role.guard';

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
