import {
  Body,
  Controller,
  Post,
  Res,
  UnauthorizedException,
  Get,
  Req,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import {
  JwtAuthGuard,
  CurrentUser,
  JwtUser,
  GatewayRoleGuard,
  RolePermission,
  DOMAINS,
} from 'shared-common';
import { UserClientService } from '../../common/services/user-client.service';
import { CookieOptions } from 'express';
import { ConfigService } from '@nestjs/config';
import { UpdateProfileDTO, ChangePasswordDTO } from './auth.dto';

@Controller('auths')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userClientService: UserClientService,
    private configService: ConfigService
  ) {}

  private getRefreshTokenCookieOptions(): CookieOptions {
    const defaultExpires = 20; // 20 seconds in milliseconds
    const configExpires = this.configService.get<string>(
      'COOKIE_REFRESH_TOKEN_EXPIRES_IN'
    );
    const refreshTokenExpires = configExpires
      ? Number(configExpires) * 1000
      : defaultExpires;
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: refreshTokenExpires,
    };
  }

  @Get('auth')
  @UseGuards(JwtAuthGuard, GatewayRoleGuard)
  @RolePermission(DOMAINS.USERS.value, DOMAINS.USERS.actions.VIEW)
  async getAuth(@CurrentUser() user: JwtUser) {
    const entityUser = await this.userClientService.findByIdWithPermissions(user.id);
    if (!entityUser) {
      throw new UnauthorizedException('Không tìm thấy người dùng');
    }
    const { password, ...plainUser } = entityUser;
    const mappedPermissions: Map<string, any> = new Map();
    const plainUserWithSummaryRole = {
      ...plainUser,
      roles: plainUser.roles.map(role => {
        role.permissions.forEach(permission => {
          mappedPermissions.set(permission.id, permission);
        });
        return {
          id: role.id,
          code: role.code,
          label: role.label,
          isAdmin: role.isAdmin,
          isSuperAdmin: role.isSuperAdmin,
          isProtected: role.isProtected,
        };
      }),
    };
    return {
      me: plainUserWithSummaryRole,
      permissions: Array.from(mappedPermissions.values()),
    };
  }

  @Post('login')
  async login(
    @Body() body: { username: string; password: string },
    @Res({ passthrough: true }) response: Response
  ) {
    const result = await this.authService.login(body.username, body.password);

    // Set refresh token in httpOnly cookie
    response.cookie(
      'refreshToken',
      result.refreshToken,
      this.getRefreshTokenCookieOptions()
    );

    // Don't send refresh token in response body
    const { refreshToken, ...responseData } = result;
    return responseData;
  }

  @Post('refresh')
  async refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ) {
    const refreshToken = request.cookies['refreshToken'];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const result = await this.authService.refreshToken(refreshToken);

    // Set new refresh token in cookie
    response.cookie(
      'refreshToken',
      result.refreshToken,
      this.getRefreshTokenCookieOptions()
    );

    // Don't send refresh token in response body
    const { refreshToken: _, ...responseData } = result;
    return responseData;
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard, GatewayRoleGuard)
  @RolePermission(DOMAINS.USERS.value, DOMAINS.USERS.actions.EDIT)
  async updateProfile(
    @CurrentUser() user: JwtUser,
    @Body() updateProfileDto: UpdateProfileDTO
  ) {
    await this.authService.updateProfile(user.id, updateProfileDto);
    return { message: 'Profile updated successfully' };
  }

  @Patch('change-password')
  @UseGuards(JwtAuthGuard, GatewayRoleGuard)
  @RolePermission(DOMAINS.USERS.value, DOMAINS.USERS.actions.CHANGE_PASSWORD)
  async changePassword(
    @CurrentUser() user: JwtUser,
    @Body() changePasswordDto: ChangePasswordDTO
  ) {
    await this.authService.changePassword(user.id, changePasswordDto);
    return { message: 'Password changed successfully' };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(
    @CurrentUser() user: JwtUser,
    @Res({ passthrough: true }) response: Response
  ) {
    // Call service method for any additional logout logic
    await this.authService.logout(user.id);

    // Clear refresh token cookie
    response.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return { message: 'Logged out successfully' };
  }
}
