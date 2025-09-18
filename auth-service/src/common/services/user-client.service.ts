import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { USER_MESSAGE_PATTERNS, SERVICE_NAMES } from 'shared-common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserClientService {
  constructor(
    @Inject(SERVICE_NAMES.MAIN_SERVICE) private readonly mainServiceClient: ClientProxy,
  ) {}

  async findByUsername(username: string): Promise<any> {
    try {
      return await firstValueFrom(
        this.mainServiceClient.send(USER_MESSAGE_PATTERNS.FIND_BY_USERNAME, { username })
      );
    } catch (error) {
      throw new HttpException(
        error.message || 'Main service error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findById(id: string): Promise<any> {
    try {
      return await firstValueFrom(
        this.mainServiceClient.send(USER_MESSAGE_PATTERNS.FIND_BY_ID, { id })
      );
    } catch (error) {
      throw new HttpException(
        error.message || 'Main service error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateLastLogin(id: string): Promise<any> {
    try {
      return await firstValueFrom(
        this.mainServiceClient.send(USER_MESSAGE_PATTERNS.UPDATE_LAST_LOGIN, { id })
      );
    } catch (error) {
      throw new HttpException(
        error.message || 'Main service error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateUser(id: string, userData: any): Promise<any> {
    try {
      return await firstValueFrom(
        this.mainServiceClient.send(USER_MESSAGE_PATTERNS.UPDATE, { id, updateUserDto: userData })
      );
    } catch (error) {
      throw new HttpException(
        error.message || 'Main service error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findByIdWithPermissions(id: string): Promise<any> {
    try {
      return await firstValueFrom(
        this.mainServiceClient.send(USER_MESSAGE_PATTERNS.FIND_BY_ID_WITH_PERMISSIONS, { id })
      );
    } catch (error) {
      throw new HttpException(
        error.message || 'Main service error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
