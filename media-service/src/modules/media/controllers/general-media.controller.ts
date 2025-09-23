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
  UploadedFiles,
  Res,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { GeneralMediaService } from '../services/general-media.service';
import { MediaListQueryDto, UpdateMediaDto, MediaResponseDto, MediaSizeResponseDto } from '../dto';
import {
  CurrentUser,
  JwtUser,
  JwtAuthGuard,
  GatewayRoleGuard,
  RolePermission,
  DOMAINS,
} from 'shared-common';
import { UseGuards } from '@nestjs/common';

@Controller(`${DOMAINS.MEDIAS.value}/general`)
@UseGuards(JwtAuthGuard, GatewayRoleGuard)
export class GeneralMediaController {
  constructor(private readonly generalMediaService: GeneralMediaService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @RolePermission(DOMAINS.MEDIAS.value, DOMAINS.MEDIAS.actions.UPLOAD)
  async uploadGeneralImage(
    @UploadedFile() file: any,
    @CurrentUser() user: JwtUser
  ): Promise<MediaResponseDto> {
    return this.generalMediaService.uploadGeneralImage(file, user);
  }

  @Post('upload-multiple')
  @UseInterceptors(FilesInterceptor('files', 10)) // Max 10 files
  @RolePermission(DOMAINS.MEDIAS.value, DOMAINS.MEDIAS.actions.UPLOAD)
  async uploadMultipleGeneralImages(
    @UploadedFiles() files: any[],
    @CurrentUser() user: JwtUser
  ): Promise<MediaResponseDto[]> {
    return this.generalMediaService.uploadMultipleGeneralImages(files, user);
  }

  @Get()
  @RolePermission(DOMAINS.MEDIAS.value, DOMAINS.MEDIAS.actions.VIEW)
  async listGeneralImages(
    @Query() query: MediaListQueryDto
  ): Promise<{ data: MediaResponseDto[]; total: number }> {
    return this.generalMediaService.listGeneralImages(query);
  }

  @Get(':id')
  @RolePermission(DOMAINS.MEDIAS.value, DOMAINS.MEDIAS.actions.VIEW)
  async getGeneralImage(@Param('id') id: string): Promise<MediaResponseDto> {
    return this.generalMediaService.getGeneralImage(id);
  }

  @Get(':id/sizes')
  @RolePermission(DOMAINS.MEDIAS.value, DOMAINS.MEDIAS.actions.VIEW)
  async getGeneralImageSizes(@Param('id') id: string): Promise<{ sizes: MediaSizeResponseDto[] }> {
    return this.generalMediaService.getGeneralImageSizes(id);
  }

  @Put(':id')
  @RolePermission(DOMAINS.MEDIAS.value, DOMAINS.MEDIAS.actions.EDIT)
  async updateGeneralImage(
    @Param('id') id: string,
    @Body() updateMediaDto: UpdateMediaDto,
    @CurrentUser() user: JwtUser
  ): Promise<MediaResponseDto> {
    return this.generalMediaService.updateGeneralImage(id, updateMediaDto, user);
  }

  @Delete(':id')
  @RolePermission(DOMAINS.MEDIAS.value, DOMAINS.MEDIAS.actions.DELETE)
  async deleteGeneralImage(
    @Param('id') id: string,
    @CurrentUser() user: JwtUser
  ): Promise<{ message: string }> {
    await this.generalMediaService.deleteGeneralImage(id, user);
    return { message: 'General image deleted successfully' };
  }

  @Get('search')
  @RolePermission(DOMAINS.MEDIAS.value, DOMAINS.MEDIAS.actions.VIEW)
  async searchGeneralImages(
    @Query('q') query: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ): Promise<{ data: MediaResponseDto[]; total: number }> {
    return this.generalMediaService.searchGeneralImages(query, { page, limit });
  }

  @Get('filter')
  @RolePermission(DOMAINS.MEDIAS.value, DOMAINS.MEDIAS.actions.VIEW)
  async filterGeneralImages(
    @Query() query: MediaListQueryDto
  ): Promise<{ data: MediaResponseDto[]; total: number }> {
    return this.generalMediaService.listGeneralImages(query);
  }

  @Get('by-tag/:tagName')
  @RolePermission(DOMAINS.MEDIAS.value, DOMAINS.MEDIAS.actions.VIEW)
  async getGeneralImagesByTag(
    @Param('tagName') tagName: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ): Promise<{ data: MediaResponseDto[]; total: number }> {
    return this.generalMediaService.getGeneralImagesByTag(tagName, { page, limit });
  }

  @Get(':id/file')
  @RolePermission(DOMAINS.MEDIAS.value, DOMAINS.MEDIAS.actions.DOWNLOAD)
  async getGeneralImageFile(
    @Param('id') id: string,
    @Query('size') size: string = 'original',
    @Res() res: Response
  ): Promise<void> {
    const fileUrl = await this.generalMediaService.getGeneralImageFileUrl(id, size);
    res.json({ url: fileUrl });
  }

  @Get(':id/file/:size')
  @RolePermission(DOMAINS.MEDIAS.value, DOMAINS.MEDIAS.actions.DOWNLOAD)
  async getGeneralImageFileBySize(
    @Param('id') id: string,
    @Param('size') size: string,
    @Res() res: Response
  ): Promise<void> {
    const fileUrl = await this.generalMediaService.getGeneralImageFileUrl(id, size);
    res.json({ url: fileUrl });
  }
}
