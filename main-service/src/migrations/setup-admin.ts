import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserService } from '../modules/user/user.service';
import { ConfigService } from '@nestjs/config';
import { RoleRepository } from '../modules/role/role.repository';
import { PermissionRepository } from '../modules/role/permission.repository';
import { DEFAULT_ROLES } from '../common/constants/default-roles';
import { DOMAINS } from 'shared-common/constants/permissions';
import { Permission } from '../modules/role/permission.entity';
import { Role } from '../modules/role/role.entity';
import { USER_STATUS } from '../modules/user/user-status.constant';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const roleRepository = app.get(RoleRepository);
  const permissionRepository = app.get(PermissionRepository);
  const userService = app.get(UserService);
  const configService = app.get(ConfigService);

  try {
    // 1. Import all permissions
    const allPermissions: Permission[] = [];
    for (const domainKey of Object.keys(DOMAINS)) {
      const domainObj = DOMAINS[domainKey];
      for (const actionKey of Object.keys(domainObj.actions)) {
        const domain = domainObj.value as string;
        const action = domainObj.actions[actionKey] as string;
        let perm = await permissionRepository.findByDomainWithAction(
          domain,
          action
        );
        if (!perm) {
          perm = await permissionRepository.create({ domain, action });
        }
        allPermissions.push(perm);
      }
    }
    console.log(`Imported ${allPermissions.length} permissions.`);

    let superAdminRole: Role | undefined = undefined;
    // 2. Import all default roles
    for (const roleDef of DEFAULT_ROLES) {
      // Map permissions from default role to permission entities
      const permissions: Permission[] = [];
      for (const p of roleDef.permissions) {
        // Sử dụng hàm findOne mới
        const perm = await permissionRepository.findByDomainWithAction(
          p.domain,
          p.action
        );
        if (perm) permissions.push(perm);
      }
      const isSuperAdmin = !!roleDef.isSuperAdmin;
      const isAdmin = !!roleDef.isAdmin || isSuperAdmin;
      const isProtected = true;
      const role = await roleRepository.create({
        code: roleDef.code,
        label: roleDef.label,
        description: roleDef.description,
        isSuperAdmin,
        isAdmin,
        isProtected,
        permissions,
      });
      if (isSuperAdmin) {
        superAdminRole = role;
      }
      console.log(`Imported role: ${roleDef.code}`);
    }

    // Create super admin user
    if (!superAdminRole) return;
    const superAdminUser = await userService.createUser({
      username: configService.getOrThrow<string>('ADMIN_USERNAME'),
      password: configService.getOrThrow<string>('ADMIN_PASSWORD'),
      roles: [superAdminRole.id],
    });

    await userService.updateUser(superAdminUser.id, {
      status: USER_STATUS.ACTIVE,
    } as any);

    console.log('\u2705 Super Admin role and user created successfully');
    console.log('Super Admin Role ID:', superAdminRole.id);
    console.log('Super Admin User ID:', superAdminUser.id);
  } catch (error) {
    console.error('\u274c Error setting up permissions/roles:', error.message);
  } finally {
    await app.close();
  }
}

bootstrap();
