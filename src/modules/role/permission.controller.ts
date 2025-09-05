import { Controller, Get, UseGuards } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { JwtAuthGuard } from '../../common/guards/auth.guard';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.permissionService.findAll();
  }
}
