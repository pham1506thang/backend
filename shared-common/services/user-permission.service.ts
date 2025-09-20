import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PERMISSION_CHECK_MESSAGE_PATTERNS, USER_MESSAGE_PATTERNS } from '../constants/message-patterns';
import { SERVICE_NAMES } from '../constants/message-queue';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserPermissionService {
  constructor(
    @Inject(SERVICE_NAMES.USER_PERMISSION_GATEWAY) private readonly userPermissionGatewayClient: ClientProxy
  ) {}

  /**
   * Check if user has permission by fetching user with permissions
   */
  async hasPermission(
    userId: string,
    domain: string,
    action: string,
  ): Promise<boolean> {
    try {
      return await firstValueFrom(
        this.userPermissionGatewayClient.send(PERMISSION_CHECK_MESSAGE_PATTERNS.FIND_BY_ID_WITH_PERMISSIONS, { userId, domain, action })
      );
    } catch (error) {
      console.error('Error checking user permission:', error);
      throw new HttpException(
        'Failed to check user permission',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get user with permissions
   */
  async getUserWithPermissions(userId: string): Promise<any> {
    try {
      return await firstValueFrom(
        this.userPermissionGatewayClient.send(USER_MESSAGE_PATTERNS.FIND_BY_ID_WITH_PERMISSIONS, { id: userId })
      );
    } catch (error) {
      console.error('Error getting user with permissions:', error);
      throw new HttpException(
        'Failed to get user permissions',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
