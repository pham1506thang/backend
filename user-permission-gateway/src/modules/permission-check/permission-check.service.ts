import { Inject, Injectable } from '@nestjs/common';
import { CacheService } from '../cache/cache.service';
import { SERVICE_NAMES, USER_MESSAGE_PATTERNS } from 'shared-common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

export interface PermissionCheckRequest {
  userId: string;
  action: string;
  domain: string;
}

export interface PermissionCheckResponse {
  hasPermission: boolean;
  isSuperAdmin: boolean;
  cached: boolean;
}

@Injectable()
export class PermissionCheckService {
  constructor(
    @Inject(SERVICE_NAMES.MAIN_SERVICE)
    private readonly mainServiceClient: ClientProxy,
    private cacheService: CacheService
  ) {}

  async checkPermission(
    request: PermissionCheckRequest
  ): Promise<PermissionCheckResponse> {
    const { userId, action, domain } = request;
    const cacheKey = `user_permissions:${userId}`;

    // Try to get from cache first
    let userPermissions = (await this.cacheService.get(cacheKey)) as any;

    if (!userPermissions) {
      // If not in cache, fetch from main service
      try {
        userPermissions = await firstValueFrom(
          this.mainServiceClient.send(USER_MESSAGE_PATTERNS.FIND_BY_ID_WITH_PERMISSIONS, {
            id: userId,
          })
        );

        // Cache the result with TTL
        this.cacheService.set(cacheKey, userPermissions, 300); // 5 minutes TTL
      } catch (error) {
        console.error(
          'Error fetching user permissions from main service:',
          error
        );
        return {
          hasPermission: false,
          cached: false,
          isSuperAdmin: false,
        };
      }
    }

    // Check if user has the required permission
    const hasPermission = this.hasUserPermission(
      userPermissions,
      action,
      domain
    );

    return {
      hasPermission,
      cached: !!userPermissions,
      isSuperAdmin: userPermissions.roles.some(role => role.isSuperAdmin),
    };
  }

  async invalidateUserCache(userId: string): Promise<void> {
    const cacheKey = `user_permissions:${userId}`;
    this.cacheService.del(cacheKey);
  }

  private hasUserPermission(
    userPermissions: any,
    action: string,
    domain: string
  ): boolean {
    if (!userPermissions) {
      return false;
    }

    const havingPermission = userPermissions.roles.some(
      role =>
        role.isSuperAdmin ||
        role.permissions.some(
          permission =>
            permission.domain === domain && permission.action === action
        )
    );

    return havingPermission;
  }
}
