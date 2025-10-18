import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileMediaController } from './controllers/profile-media.controller';
import { GeneralMediaController } from './controllers/general-media.controller';
import { ProfileMediaService } from './services/profile-media.service';
import { GeneralMediaService } from './services/general-media.service';
import { BaseMediaService } from './services/base-media.service';
import { MediaRepository } from './repositories/media.repository';
import { Media, MediaSize, MediaTag } from './entities';
import { LocalStorageService } from './services/local-storage.service';
import { FileOperationsService } from './services/file-operations.service';
import { ImageProcessingService } from './services/image-processing.service';
import { GatewayRoleGuard, UserPermissionService, UserPermissionGatewayMicroserviceModule } from 'shared-common';
import { MediaSizeRepository } from './repositories/media-size.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Media, MediaSize, MediaTag]),
    UserPermissionGatewayMicroserviceModule,
  ],
  controllers: [
    ProfileMediaController,
    GeneralMediaController,
  ],
  providers: [
    MediaRepository,
    MediaSizeRepository,
    BaseMediaService,
    ProfileMediaService,
    GeneralMediaService,
    LocalStorageService,
    FileOperationsService,
    ImageProcessingService,
    GatewayRoleGuard,
    UserPermissionService,
  ],
  exports: [
    ProfileMediaService,
    GeneralMediaService,
  ],
})
export class MediaModule {}
