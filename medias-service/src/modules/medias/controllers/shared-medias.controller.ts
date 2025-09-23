import {
  Controller,
  Get,
  Param,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { SharedMediaService } from '../services/shared-media.service';
import { MediaListQueryDto, MediaResponseDto } from '../dto';
import {
  JwtAuthGuard,
  GatewayRoleGuard,
  RolePermission,
  DOMAINS,
} from 'shared-common';
import { UseGuards } from '@nestjs/common';

@Controller('medias')
@UseGuards(JwtAuthGuard, GatewayRoleGuard)
export class SharedMediasController {
  constructor(private readonly sharedMediaService: SharedMediaService) {}

  // Cross-category search operations
  @Get('search')
  @RolePermission(DOMAINS.MEDIAS.value, DOMAINS.MEDIAS.actions.VIEW)
  async search(
    @Query('q') query: string,
    @Query('category') category?: string,
    @Query('type') type?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ): Promise<{ data: MediaResponseDto[]; total: number }> {
    return this.sharedMediaService.search(query, { category, type, page, limit });
  }

  @Get('filter')
  @RolePermission(DOMAINS.MEDIAS.value, DOMAINS.MEDIAS.actions.VIEW)
  async filter(
    @Query() query: MediaListQueryDto
  ): Promise<{ data: MediaResponseDto[]; total: number }> {
    return this.sharedMediaService.filter(query);
  }

  @Get('tags')
  @RolePermission(DOMAINS.MEDIAS.value, DOMAINS.MEDIAS.actions.VIEW)
  async getTags(): Promise<{ tags: string[] }> {
    return this.sharedMediaService.getAllTags();
  }

  @Get('by-tag/:tagName')
  @RolePermission(DOMAINS.MEDIAS.value, DOMAINS.MEDIAS.actions.VIEW)
  async getByTag(
    @Param('tagName') tagName: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ): Promise<{ data: MediaResponseDto[]; total: number }> {
    return this.sharedMediaService.getByTag(tagName, { page, limit });
  }

  // Cross-category file serving
  @Get(':id/file')
  @RolePermission(DOMAINS.MEDIAS.value, DOMAINS.MEDIAS.actions.DOWNLOAD)
  async getFile(
    @Param('id') id: string,
    @Query('size') size: string = 'original',
    @Res() res: Response
  ): Promise<void> {
    const fileUrl = await this.sharedMediaService.getFileUrl(id, size);
    res.json({ url: fileUrl });
  }

  @Get(':id/file/:size')
  @RolePermission(DOMAINS.MEDIAS.value, DOMAINS.MEDIAS.actions.DOWNLOAD)
  async getFileBySize(
    @Param('id') id: string,
    @Param('size') size: string,
    @Res() res: Response
  ): Promise<void> {
    const fileUrl = await this.sharedMediaService.getFileUrl(id, size);
    res.json({ url: fileUrl });
  }
}
