import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JWTUser } from 'src/common/interfaces/jwt-user.interface';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JWTUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
