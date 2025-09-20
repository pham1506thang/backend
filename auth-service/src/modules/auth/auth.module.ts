import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { UserPermissionService, MainMicroserviceModule, UserPermissionGatewayMicroserviceModule, JwtAuthModule } from 'shared-common';
import { UserClientService } from '../../common/services/user-client.service';
import { GatewayRoleGuard } from 'shared-common';

@Module({
  imports: [
    ConfigModule,
    JwtAuthModule,
    MainMicroserviceModule,
    UserPermissionGatewayMicroserviceModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UserClientService, GatewayRoleGuard, UserPermissionService],
  exports: [JwtAuthModule],
})
export class AuthModule {}
