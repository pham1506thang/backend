import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { MediasService } from './medias.service';
import { UpdateMediaDto, MediaListQueryDto, MediaResponseDto } from './dto';
import {
  CurrentUser,
  JwtUser,
  JwtAuthGuard,
  GatewayRoleGuard,
  RolePermission,
  DOMAINS,
} from 'shared-common';
import { UseGuards } from '@nestjs/common';

@Controller('medias')
@UseGuards(JwtAuthGuard, GatewayRoleGuard)
export class MediasController {
  constructor(private readonly mediasService: MediasService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @RolePermission(DOMAINS.MEDIAS.value, DOMAINS.MEDIAS.actions.UPLOAD)
  async uploadFile(
    @UploadedFile() file: any,
    @CurrentUser() user: JwtUser
  ): Promise<MediaResponseDto> {
    return this.mediasService.uploadFile(file, user);
  }

  @Get()
  @RolePermission(DOMAINS.MEDIAS.value, DOMAINS.MEDIAS.actions.VIEW)
  async findAll(
    @Query() query: MediaListQueryDto
  ): Promise<{ data: MediaResponseDto[]; total: number }> {
    return this.mediasService.findAll(query);
  }

  @Get(':id')
  @RolePermission(DOMAINS.MEDIAS.value, DOMAINS.MEDIAS.actions.VIEW)
  async findOne(@Param('id') id: string): Promise<MediaResponseDto> {
    return this.mediasService.findOne(id);
  }

  @Put(':id')
  @RolePermission(DOMAINS.MEDIAS.value, DOMAINS.MEDIAS.actions.EDIT)
  async update(
    @Param('id') id: string,
    @Body() updateMediaDto: UpdateMediaDto,
    @CurrentUser() user: JwtUser
  ): Promise<MediaResponseDto> {
    return this.mediasService.update(id, updateMediaDto, user);
  }

  @Delete(':id')
  @RolePermission(DOMAINS.MEDIAS.value, DOMAINS.MEDIAS.actions.DELETE)
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: JwtUser
  ): Promise<{ message: string }> {
    await this.mediasService.remove(id, user);
    return { message: 'Media deleted successfully' };
  }

  @Get(':id/file')
  @RolePermission(DOMAINS.MEDIAS.value, DOMAINS.MEDIAS.actions.DOWNLOAD)
  async getFile(
    @Param('id') id: string,
    @Query('size') size: string = 'original',
    @Res() res: Response
  ): Promise<void> {
    const fileUrl = await this.mediasService.getFileUrl(id, size);

    // For now, just return the URL
    // In production, you might want to stream the file directly
    res.json({ url: fileUrl });
  }

  @Get(':id/file/:size')
  @RolePermission(DOMAINS.MEDIAS.value, DOMAINS.MEDIAS.actions.DOWNLOAD)
  async getFileBySize(
    @Param('id') id: string,
    @Param('size') size: string,
    @Res() res: Response
  ): Promise<void> {
    const fileUrl = await this.mediasService.getFileUrl(id, size);
    res.json({ url: fileUrl });
  }

  @Get(':id/sizes')
  @RolePermission(DOMAINS.MEDIAS.value, DOMAINS.MEDIAS.actions.VIEW)
  async getAvailableSizes(
    @Param('id') id: string
  ): Promise<{ sizes: string[] }> {
    const sizes = await this.mediasService.getAvailableSizes(id);
    return { sizes };
  }

  @Get('search')
  @RolePermission(DOMAINS.MEDIAS.value, DOMAINS.MEDIAS.actions.VIEW)
  async search(
    @Query('q') query: string,
    @Query('type') type?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ): Promise<{ data: MediaResponseDto[]; total: number }> {
    return this.mediasService.search(query, { type, page, limit });
  }

  @Get('filter')
  @RolePermission(DOMAINS.MEDIAS.value, DOMAINS.MEDIAS.actions.VIEW)
  async filter(
    @Query() query: MediaListQueryDto
  ): Promise<{ data: MediaResponseDto[]; total: number }> {
    return this.mediasService.findAll(query);
  }

  @Get('tags')
  @RolePermission(DOMAINS.MEDIAS.value, DOMAINS.MEDIAS.actions.VIEW)
  async getTags(): Promise<{ tags: string[] }> {
    const tags = await this.mediasService.getAllTags();
    return { tags };
  }

  @Get('by-tag/:tagName')
  @RolePermission(DOMAINS.MEDIAS.value, DOMAINS.MEDIAS.actions.VIEW)
  async getByTag(
    @Param('tagName') tagName: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ): Promise<{ data: MediaResponseDto[]; total: number }> {
    return this.mediasService.getByTag(tagName, { page, limit });
  }

  // Profile Upload Endpoints (no permissions required)
  @Post('profile/upload-avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(
    @UploadedFile() file: any,
    @CurrentUser() user: JwtUser
  ): Promise<{ message: string; avatarUrl: string }> {
    const avatarUrl = await this.mediasService.uploadAvatar(file, user);
    return {
      message: 'Avatar uploaded successfully',
      avatarUrl,
    };
  }

  @Get('profile/avatar')
  async getAvatar(
    @CurrentUser() user: JwtUser,
    @Res() res: Response
  ): Promise<void> {
    const avatarUrl = await this.mediasService.getAvatarUrl(user.id);
    res.json({ avatarUrl });
  }

  @Delete('profile/avatar')
  async deleteAvatar(
    @CurrentUser() user: JwtUser
  ): Promise<{ message: string }> {
    await this.mediasService.deleteAvatar(user.id);
    return { message: 'Avatar deleted successfully' };
  }

  @Get('profile/avatar/:userId')
  async getAvatarByUserId(
    @Param('userId') userId: string,
    @Res() res: Response
  ): Promise<void> {
    const avatarUrl = await this.mediasService.getAvatarUrl(userId);
    res.json({ avatarUrl });
  }
}
