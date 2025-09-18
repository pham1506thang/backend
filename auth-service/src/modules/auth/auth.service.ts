import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserClientService } from '../../common/services/user-client.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtUser } from 'shared-common';
import { ConfigService } from '@nestjs/config';
import { UpdateProfileDTO, ChangePasswordDTO } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userClient: UserClientService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userClient.findByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    throw new BadRequestException('Invalid username or password');
  }

  private generateAuthResponse(user: any) {
    const payload: JwtUser = {
      id: user.id,
      username: user.username,
    };

    const accessTokenExpires =
      this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES_IN') || '10s';

    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: accessTokenExpires,
      }),
      refreshToken: this.jwtService.sign(payload),
    };
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);

    // Update last login time
    await this.userClient.updateLastLogin(user.id);

    return this.generateAuthResponse(user);
  }

  async refreshToken(token: string) {
    try {
      // Verify the refresh token but ignore expiration
      const payload = this.jwtService.verify(token, {
        ignoreExpiration: true, // Ignore JWT expiration since we're using cookie expiration
      });

      // Get user to verify it exists
      const user = await this.userClient.findById(payload.id);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return this.generateAuthResponse(user);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async updateProfile(userId: string, dto: UpdateProfileDTO) {
    return this.userClient.updateUser(userId, dto);
  }

  async changePassword(userId: string, dto: ChangePasswordDTO) {
    return this.userClient.updateUser(userId, dto);
  }

  async logout(userId: string) {
    // For now, just return success
    // In the future, you might want to:
    // - Add token to blacklist
    // - Update user's last logout time
    // - Invalidate all user sessions
    return { message: 'Logged out successfully' };
  }
}
