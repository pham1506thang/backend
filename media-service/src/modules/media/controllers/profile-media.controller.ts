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
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ProfileMediaService } from '../services/profile-media.service';
import { UpdateMediaDto, MediaResponseDto } from '../dto';
import {
  CurrentUser,
  JwtUser,
  JwtAuthGuard,
  DOMAINS,
  InfiniteParamsDto,
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
  async findInfiniteProfileImages(
    @Query() params: InfiniteParamsDto,
    @CurrentUser() user: JwtUser
  ) {
    return this.profileMediaService.findInfiniteProfileImages(params, user);
  }

  @Get(':id')
  async getProfileImage(
    @Param('id') id: string,
    @CurrentUser() user: JwtUser
  ): Promise<MediaResponseDto> {
    return this.profileMediaService.getProfileImage(id, user);
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

}
