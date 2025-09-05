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
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDTO, UpdateRoleDTO } from './role.dto';
import { DOMAINS } from 'common/constants/permissions';
import { RoleGuard } from '../../common/guards/role.guard';
import { RolePermission } from '../../common/decorators/role-permission.decorator';
import { JwtAuthGuard } from 'common/guards/auth.guard';
import { ProtectedRoleGuard } from '../../common/guards/protected-role.guard';
import { AdminRoleGuard } from '../../common/guards/admin-role.guard';
import { PaginationParamsDto } from 'common/dto/pagination-params.dto';

@Controller(DOMAINS.ROLES.value)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolePermission(DOMAINS.ROLES.value, DOMAINS.ROLES.actions.VIEW)
  findPaginatedRoles(@Query() params: PaginationParamsDto) {
    return this.roleService.findPaginatedRoles(params);
  }

  @Get('summary')
  @UseGuards(JwtAuthGuard)
  findAllSummary() {
    return this.roleService.findAllSummary();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard, AdminRoleGuard)
  @RolePermission(DOMAINS.ROLES.value, 'create')
  create(@Body() body: CreateRoleDTO) {
    return this.roleService.create(body);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleGuard, AdminRoleGuard, ProtectedRoleGuard)
  @RolePermission(DOMAINS.ROLES.value, 'update')
  update(@Param('id') id: string, @Body() body: UpdateRoleDTO) {
    return this.roleService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard, ProtectedRoleGuard)
  @RolePermission(DOMAINS.ROLES.value, 'delete')
  remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }
}
