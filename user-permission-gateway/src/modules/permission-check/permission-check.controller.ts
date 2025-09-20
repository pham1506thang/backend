import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PermissionCheckService, PermissionCheckRequest } from './permission-check.service';
import { PERMISSION_CHECK_MESSAGE_PATTERNS } from 'shared-common';

@Controller()
export class PermissionCheckController {
  constructor(private readonly permissionCheckService: PermissionCheckService) {}

  @MessagePattern(PERMISSION_CHECK_MESSAGE_PATTERNS.FIND_BY_ID_WITH_PERMISSIONS)
  async checkPermission(@Payload() request: PermissionCheckRequest): Promise<boolean> {
    return this.permissionCheckService.checkPermission(request);
  }

    @MessagePattern(PERMISSION_CHECK_MESSAGE_PATTERNS.INVALIDATE_PERMISSION_CACHE)
  async invalidateUserCache(@Payload() data: { userId: string }): Promise<void> {
    return this.permissionCheckService.invalidateUserCache(data.userId);
  }
}
