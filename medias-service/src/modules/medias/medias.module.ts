import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediasController } from './medias.controller';
import { MediasService } from './medias.service';
import { Media, MediaVersion, MediaSize, MediaTag } from './entities';
import { LocalStorageService } from './services/local-storage.service';
import { FileOperationsService } from './services/file-operations.service';
import { ImageProcessingService } from './services/image-processing.service';
import { QueueModule } from '../queue/queue.module';
import { WebSocketModule } from '../websocket/websocket.module';
import { GatewayRoleGuard } from 'shared-common';

@Module({
  imports: [
    TypeOrmModule.forFeature([Media, MediaVersion, MediaSize, MediaTag]),
    QueueModule,
    WebSocketModule,
  ],
  controllers: [MediasController],
  providers: [
    MediasService,
    LocalStorageService,
    FileOperationsService,
    ImageProcessingService,
    GatewayRoleGuard,
  ],
  exports: [MediasService],
})
export class MediasModule {}
