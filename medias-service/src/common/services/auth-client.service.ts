import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { JwtUser } from 'shared-common';

@Injectable()
export class AuthClientService {
  private readonly authServiceUrl: string;
  private readonly httpClient: AxiosInstance;

  constructor(private configService: ConfigService) {
    this.authServiceUrl =
      this.configService.get<string>('AUTH_SERVICE_URL') ||
      'http://localhost:3002';

    this.httpClient = axios.create({
      baseURL: this.authServiceUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add response interceptor để handle errors
    this.httpClient.interceptors.response.use(
      response => response,
      error => {
        if (error.response) {
          throw new HttpException(
            error.response.data.message || 'Auth service error',
            error.response.status
          );
        } else if (error.request) {
          throw new HttpException(
            'Auth service unavailable',
            HttpStatus.SERVICE_UNAVAILABLE
          );
        } else {
          throw new HttpException(
            'Request error',
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        }
      }
    );
  }

  async verifyToken(token: string): Promise<JwtUser> {
    const response = await this.httpClient.post('/auth/verify', { token });
    return response.data;
  }

  async getUserById(userId: string): Promise<any> {
    const response = await this.httpClient.get(`/auth/user/${userId}`);
    return response.data;
  }
}
