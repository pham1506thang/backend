import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { JwtPayload } from 'common/interfaces/jwt-user.interface';
import { User, UserDocument } from '../user/user.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userService.findByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    throw new BadRequestException('Invalid username or password');
  }

  private generateAuthResponse(user: User) {
    const payload: JwtPayload = { 
      _id: user._id.toString(), 
      username: user.username, 
      roles: user.roles.map(role => role._id.toString())
    };

    const accessTokenExpires = this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES_IN') || '10s';
    
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: accessTokenExpires }),
      refreshToken: this.jwtService.sign(payload),
    };
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);
    
    // Update last login time
    await this.userService.updateLastLogin(user._id);
    
    return this.generateAuthResponse(user);
  }

  async refreshToken(token: string) {
    try {
      // Verify the refresh token but ignore expiration
      const payload = this.jwtService.verify(token, {
        ignoreExpiration: true // Ignore JWT expiration since we're using cookie expiration
      }) as JwtPayload;
      
      // Get user to verify it exists
      const user = await this.userService.findByUsername(payload.username);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return this.generateAuthResponse(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
