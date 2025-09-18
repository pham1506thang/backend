import { Module } from '@nestjs/common';
import { PermissionCheckService } from './permission-check.service';
import { PermissionCheckController } from './permission-check.controller';
import { CacheModule } from '../cache/cache.module';
import { MainMicroserviceModule } from 'shared-common';

@Module({
  imports: [MainMicroserviceModule, CacheModule],
  providers: [PermissionCheckService],
  controllers: [PermissionCheckController],
  exports: [PermissionCheckService],
})
export class PermissionCheckModule {}
