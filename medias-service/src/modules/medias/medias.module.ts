import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedMediasController } from './controllers/shared-medias.controller';
import { ProfileMediasController } from './controllers/profile-medias.controller';
import { GeneralMediasController } from './controllers/general-medias.controller';
import { SharedMediaService } from './services/shared-media.service';
import { ProfileMediaService } from './services/profile-media.service';
import { GeneralMediaService } from './services/general-media.service';
import { Media, MediaSize, MediaTag } from './entities';
import { LocalStorageService } from './services/local-storage.service';
import { FileOperationsService } from './services/file-operations.service';
import { ImageProcessingService } from './services/image-processing.service';
import { GatewayRoleGuard, UserPermissionService, UserPermissionGatewayMicroserviceModule } from 'shared-common';

@Module({
  imports: [
    TypeOrmModule.forFeature([Media, MediaSize, MediaTag]),
    UserPermissionGatewayMicroserviceModule,
  ],
  controllers: [
    SharedMediasController,
    ProfileMediasController,
    GeneralMediasController,
  ],
  providers: [
    SharedMediaService,
    ProfileMediaService,
    GeneralMediaService,
    LocalStorageService,
    FileOperationsService,
    ImageProcessingService,
    GatewayRoleGuard,
    UserPermissionService,
  ],
  exports: [
    SharedMediaService,
    ProfileMediaService,
    GeneralMediaService,
  ],
})
export class MediasModule {}
