import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy, UserPermissionService, MainMicroserviceModule, UserPermissionGatewayMicroserviceModule } from 'shared-common';
import { UserClientService } from '../../common/services/user-client.service';
import { GatewayRoleGuard } from 'shared-common';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    MainMicroserviceModule,
    UserPermissionGatewayMicroserviceModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn:
            configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES_IN') || '10s',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserClientService, GatewayRoleGuard, UserPermissionService, JwtStrategy],
  exports: [PassportModule, JwtStrategy],
})
export class AuthModule {}
