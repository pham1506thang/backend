import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { RoleService } from 'src/modules/role/role.service';

@Injectable()
export class ProtectedRoleGuard implements CanActivate {
  constructor(private readonly roleService: RoleService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const roleId = request.params.id;
    const user = request.user;

    // Only check for PATCH / PUT and DELETE methods
    if (
      !roleId ||
      (method !== 'PATCH' && method !== 'DELETE' && method !== 'PUT')
    ) {
      return true;
    }

    const targetRole = await this.roleService.findById(roleId);
    
    // Ensure user.roles is an array
    const userRoleIds = Array.isArray(user.roles) ? user.roles : [];
    const userRoles = userRoleIds.length > 0 ? await this.roleService.findByIds(userRoleIds) : [];

    // Check if user has any admin role
    const hasAdminRole = userRoles.some(role => role.isAdmin);

    // If user has admin role
    if (hasAdminRole) {
      // Admin cannot modify their own roles
      if (userRoleIds.includes(roleId)) {
        throw new ForbiddenException('Admin cannot modify their own role');
      }
      return true;
    }

    if (!targetRole) {
      throw new ForbiddenException('Role not found');
    }
    if (targetRole.isProtected) {
      throw new ForbiddenException('Cannot modify or delete protected roles');
    }

    return true;
  }
}
