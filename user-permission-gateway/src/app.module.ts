import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PermissionCheckModule } from './modules/permission-check/permission-check.module';
import { CacheModule } from './modules/cache/cache.module';
import { HealthModule } from './modules/health/health.module';
import { UserPermissionGatewayMicroserviceModule } from 'shared-common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserPermissionGatewayMicroserviceModule,
    PermissionCheckModule,
    CacheModule,
    HealthModule,
  ],
})
export class AppModule {}
