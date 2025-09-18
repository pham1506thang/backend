import { Module } from '@nestjs/common';
import { UserPermissionService } from '../services/user-permission.service';

@Module({
  providers: [UserPermissionService],
  exports: [UserPermissionService],
})
export class UserPermissionGatewayModule {}
