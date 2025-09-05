import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const body = request.body;

    // If trying to set isAdmin through API, throw error
    if (body.isAdmin !== undefined) {
      throw new ForbiddenException(
        'User cannot set isAdmin because Admin role is created by system',
      );
    }

    return true;
  }
}
