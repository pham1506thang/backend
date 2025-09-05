import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtPayload } from 'common/interfaces/jwt-user.interface';
import { RoleService } from 'modules/role/role.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly roleService: RoleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user as JwtPayload;

    if (!user) return false;

    const { domain, action } =
      this.reflector.get('role-permission', context.getHandler()) || {};

    // If no permission requirements are set, allow access
    if (!domain || !action) return true;

    // roleIds là mảng string
    const roleIds = user.roles || [];

    return await this.roleService.hasPermission(roleIds, domain, action);
  }
}
