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
import { ProfileMediaService } from '../services/profile-media.service';
import { MediaListQueryDto, UpdateMediaDto, MediaResponseDto } from '../dto';
import {
  CurrentUser,
  JwtUser,
  JwtAuthGuard,
  DOMAINS,
} from 'shared-common';
import { UseGuards } from '@nestjs/common';

@Controller(`${DOMAINS.MEDIAS.value}/profile`)
@UseGuards(JwtAuthGuard)
export class ProfileMediaController {
  constructor(private readonly profileMediaService: ProfileMediaService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfileImage(
    @UploadedFile() file: any,
    @CurrentUser() user: JwtUser
  ): Promise<MediaResponseDto> {
    return this.profileMediaService.uploadProfileImage(file, user);
  }

  @Post('upload-multiple')
  @UseInterceptors(FilesInterceptor('files', 10)) // Max 10 files
  async uploadMultipleProfileImages(
    @UploadedFiles() files: any[],
    @CurrentUser() user: JwtUser
  ): Promise<MediaResponseDto[]> {
    return this.profileMediaService.uploadMultipleProfileImages(files, user);
  }

  @Get()
  async listProfileImages(
    @Query() query: MediaListQueryDto,
    @CurrentUser() user: JwtUser
  ): Promise<{ data: MediaResponseDto[]; total: number }> {
    // Only show user's own profile images
    query.userId = user.id;
    return this.profileMediaService.listProfileImages(query);
  }

  @Get(':id')
  async getProfileImage(
    @Param('id') id: string,
    @CurrentUser() user: JwtUser
  ): Promise<MediaResponseDto> {
    return this.profileMediaService.getProfileImage(id, user);
  }

  @Get(':id/sizes')
  async getProfileImageSizes(
    @Param('id') id: string,
    @CurrentUser() user: JwtUser
  ): Promise<{ sizes: string[] }> {
    return this.profileMediaService.getProfileImageSizes(id, user);
  }

  @Put(':id')
  async updateProfileImage(
    @Param('id') id: string,
    @Body() updateMediaDto: UpdateMediaDto,
    @CurrentUser() user: JwtUser
  ): Promise<MediaResponseDto> {
    return this.profileMediaService.updateProfileImage(id, updateMediaDto, user);
  }

  @Delete(':id')
  async deleteProfileImage(
    @Param('id') id: string,
    @CurrentUser() user: JwtUser
  ): Promise<{ message: string }> {
    await this.profileMediaService.deleteProfileImage(id, user);
    return { message: 'Profile image deleted successfully' };
  }

  @Get('search')
  async searchProfileImages(
    @Query('q') query: string,
    @CurrentUser() user: JwtUser,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ): Promise<{ data: MediaResponseDto[]; total: number }> {
    return this.profileMediaService.searchProfileImages(query, { page, limit, userId: user.id });
  }

  @Get('filter')
  async filterProfileImages(
    @Query() query: MediaListQueryDto,
    @CurrentUser() user: JwtUser
  ): Promise<{ data: MediaResponseDto[]; total: number }> {
    query.userId = user.id;
    return this.profileMediaService.listProfileImages(query);
  }

  @Get('by-tag/:tagName')
  async getProfileImagesByTag(
    @Param('tagName') tagName: string,
    @CurrentUser() user: JwtUser,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ): Promise<{ data: MediaResponseDto[]; total: number }> {
    return this.profileMediaService.getProfileImagesByTag(tagName, { page, limit, userId: user.id });
  }

  @Get(':id/file')
  async getProfileImageFile(
    @Param('id') id: string,
    @Query('size') size: string = 'original',
    @CurrentUser() user: JwtUser,
    @Res() res: Response
  ): Promise<void> {
    const fileUrl = await this.profileMediaService.getProfileImageFileUrl(id, size, user);
    res.json({ url: fileUrl });
  }

  @Get(':id/file/:size')
  async getProfileImageFileBySize(
    @Param('id') id: string,
    @Param('size') size: string,
    @CurrentUser() user: JwtUser,
    @Res() res: Response
  ): Promise<void> {
    const fileUrl = await this.profileMediaService.getProfileImageFileUrl(id, size, user);
    res.json({ url: fileUrl });
  }
}
