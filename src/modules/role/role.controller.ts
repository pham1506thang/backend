import { Body, Controller, Post, UseGuards, Patch, Param, Delete } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDTO, UpdateRoleDTO } from './role.dto';
import { Actions, Domains } from 'common/constants/permissions';
import { RoleGuard } from '../../common/guards/role.guard';
import { RolePermission } from '../../common/decorators/role-permission.decorator';
import { JwtAuthGuard } from 'common/guards/auth.guard';
import { ProtectedRoleGuard } from '../../common/guards/protected-role.guard';
import { AdminRoleGuard } from '../../common/guards/admin-role.guard';

@Controller(Domains.Roles)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard, AdminRoleGuard)
  @RolePermission(Domains.Roles, Actions.Create)
  create(@Body() body: CreateRoleDTO) {
    return this.roleService.create(body);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleGuard, AdminRoleGuard, ProtectedRoleGuard)
  @RolePermission(Domains.Roles, Actions.Update)
  update(@Param('id') id: string, @Body() body: UpdateRoleDTO) {
    return this.roleService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard, ProtectedRoleGuard)
  @RolePermission(Domains.Roles, Actions.Delete)
  remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }
}
