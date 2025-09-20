import { Module } from '@nestjs/common';
import { UserPermissionService } from '../services/user-permission.service';
import { UserPermissionGatewayMicroserviceModule } from './microservice/user-permission-gateway-microservice.module';

@Module({
  imports: [UserPermissionGatewayMicroserviceModule],
  providers: [UserPermissionService],
  exports: [UserPermissionService],
})
export class UserPermissionGatewayModule {}
