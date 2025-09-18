import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { RoleRepository } from './role.repository';
import { ConfigService } from '@nestjs/config';
import { Permission } from './permission.entity';
import { PermissionRepository } from './permission.repository';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { ProtectedRoleGuard } from '../../common/guards/protected-role.guard';
import { GatewayRoleGuard, UserPermissionService, UserPermissionGatewayMicroserviceModule } from 'shared-common';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, Permission]),
    UserPermissionGatewayMicroserviceModule,
  ],
  providers: [
    RoleService,
    RoleRepository,
    PermissionRepository,
    ConfigService,
    PermissionService,
    ProtectedRoleGuard,
    GatewayRoleGuard,
    UserPermissionService,
  ],
  controllers: [RoleController, PermissionController],
  exports: [RoleService, RoleRepository, ProtectedRoleGuard, GatewayRoleGuard], // Export RoleRepository for use in other modules
})
export class RoleModule {}
