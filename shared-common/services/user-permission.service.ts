import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { USER_MESSAGE_PATTERNS } from '../constants/message-patterns';
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
      const user = await firstValueFrom(
        this.userPermissionGatewayClient.send(USER_MESSAGE_PATTERNS.FIND_BY_ID_WITH_PERMISSIONS, { id: userId })
      );
      
      if (!user || !user.roles) {
        return false;
      }

      // Check if user has any role with the required permission
      for (const role of user.roles) {
        if (role.permissions) {
          for (const permission of role.permissions) {
            if (permission.domain === domain && permission.action === action) {
              return true;
            }
          }
        }
      }

      return false;
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
