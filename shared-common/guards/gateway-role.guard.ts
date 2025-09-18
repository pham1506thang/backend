import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtUser } from '../interfaces/jwt-user.interface';
import { UserPermissionService } from '../services/user-permission.service';

@Injectable()
export class GatewayRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userPermissionService: UserPermissionService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user as JwtUser;

    if (!user) return false;

    const { domain, action } =
      this.reflector.get('role-permission', context.getHandler()) || {};

    // If no permission requirements are set, allow access
    if (!domain || !action) return true;

    // Use user permission service to check permission
    return await this.userPermissionService.hasPermission(user.id, domain, action);
  }
}
