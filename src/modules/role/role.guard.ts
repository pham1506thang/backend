import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { Reflector } from '@nestjs/core';
import { JWTUser } from 'src/common/interfaces/jwt-user.interface';
import { RoleService } from 'src/modules/role/role.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly roleService: RoleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user as JWTUser;

    if (!user) return false;
    const { domain, action } =
      this.reflector.get('role-permission', context.getHandler()) || {};
    return await this.roleService.hasPermission(
      new Types.ObjectId(user.role),
      domain,
      action,
    );
  }
}
