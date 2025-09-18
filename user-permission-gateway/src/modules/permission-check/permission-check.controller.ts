import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PermissionCheckService, PermissionCheckRequest, PermissionCheckResponse } from './permission-check.service';
import { USER_MESSAGE_PATTERNS } from 'shared-common';

@Controller()
export class PermissionCheckController {
  constructor(private readonly permissionCheckService: PermissionCheckService) {}

  @MessagePattern(USER_MESSAGE_PATTERNS.FIND_BY_ID_WITH_PERMISSIONS)
  async checkPermission(@Payload() request: PermissionCheckRequest): Promise<PermissionCheckResponse> {
    return this.permissionCheckService.checkPermission(request);
  }

    @MessagePattern(USER_MESSAGE_PATTERNS.INVALIDATE_PERMISSION_CACHE)
  async invalidateUserCache(@Payload() data: { userId: string }): Promise<void> {
    return this.permissionCheckService.invalidateUserCache(data.userId);
  }
}
