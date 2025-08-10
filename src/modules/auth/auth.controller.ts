import { Body, Controller, Post, Res, UnauthorizedException, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtUser } from 'common/interfaces/jwt-user.interface';
import { UserService } from '../user/user.service';
import { CookieOptions } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auths')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  private getRefreshTokenCookieOptions(): CookieOptions {
    const defaultExpires = 20; // 20 seconds in milliseconds
    const configExpires = this.configService.get<string>('COOKIE_REFRESH_TOKEN_EXPIRES_IN');
    const refreshTokenExpires = configExpires ? Number(configExpires) * 1000 : defaultExpires;
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: refreshTokenExpires,
    };
  }

  @Post('login')
  async login(
    @Body() body: { username: string; password: string },
    @Res({ passthrough: true }) response: Response
  ) {
    const result = await this.authService.login(body.username, body.password);
    
    // Set refresh token in httpOnly cookie
    response.cookie('refreshToken', result.refreshToken, this.getRefreshTokenCookieOptions());

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
    response.cookie('refreshToken', result.refreshToken, this.getRefreshTokenCookieOptions());

    // Don't send refresh token in response body
    const { refreshToken: newRefreshToken, ...responseData } = result;
    return responseData;
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@CurrentUser() user: JwtUser) {
    const userWithRoles = await this.userService.findByUsername(user.username);
    if (!userWithRoles) {
      throw new UnauthorizedException('User not found');
    }
    // Loại bỏ password khỏi entity trả về
    const { password, ...plainUser } = userWithRoles;
    return plainUser;
  }
}