import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { JwtPayload } from 'common/interfaces/jwt-user.interface';
import { User, UserDocument } from '../user/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userService.findByUsernameWithRoles(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    throw new UnauthorizedException();
  }

  private generateAuthResponse(user: User) {
    const payload: JwtPayload = { 
      _id: user._id.toString(), 
      username: user.username, 
      roles: user.roles.map(role => role._id.toString())
    };

    const plainUser = user.toObject();
    delete plainUser.password;
    
    return {
      user: plainUser,
      accessToken: this.jwtService.sign(payload, { expiresIn: '1d' }),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
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
      // Verify the refresh token
      const payload = this.jwtService.verify(token) as JwtPayload;
      
      // Get user with populated roles
      const user = await this.userService.findByUsernameWithRoles(payload.username);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return this.generateAuthResponse(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
