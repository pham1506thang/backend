import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediasModule } from './modules/medias/medias.module';
import { QueueModule } from './modules/queue/queue.module';
import { WebSocketModule } from './modules/websocket/websocket.module';
import { UserPermissionGatewayModule, MediasMicroserviceModule } from 'shared-common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    MediasMicroserviceModule,
    MediasModule,
    QueueModule,
    WebSocketModule,
    UserPermissionGatewayModule,
  ],
})
export class AppModule {}
