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
import { GeneralMediaService } from '../services/general-media.service';
import { UpdateMediaDto, MediaResponseDto } from '../dto';
import {
  CurrentUser,
  JwtUser,
  JwtAuthGuard,
  GatewayRoleGuard,
  RolePermission,
  DOMAINS,
  InfiniteParamsDto,
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
  async findInfiniteGeneralImages(
    @Query() params: InfiniteParamsDto
  ) {
    return this.generalMediaService.findInfiniteGeneralImages(params);
  }

  @Get(':id')
  @RolePermission(DOMAINS.MEDIAS.value, DOMAINS.MEDIAS.actions.VIEW)
  async getGeneralImage(@Param('id') id: string): Promise<MediaResponseDto> {
    return this.generalMediaService.getGeneralImage(id);
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

}
