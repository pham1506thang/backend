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

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission])],
  providers: [
    RoleService,
    RoleRepository,
    PermissionRepository,
    ConfigService,
    PermissionService,
  ],
  controllers: [RoleController, PermissionController],
  exports: [RoleService, RoleRepository], // Export RoleRepository for use in other modules
})
export class RoleModule {}
