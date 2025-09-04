
import { Injectable } from '@nestjs/common';
import { PermissionRepository } from './permission.repository';

@Injectable()
export class PermissionService {
  constructor(
    private readonly permissionRepository: PermissionRepository,
  ) { }

  async findAll() {
    return this.permissionRepository.findAll();
  }
}
