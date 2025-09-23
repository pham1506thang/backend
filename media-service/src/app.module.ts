import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaModule } from './modules/media/media.module';
import { HealthModule } from './modules/health/health.module';
import { MediaMicroserviceModule, JwtAuthModule } from 'shared-common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.MEDIA_DB_HOST || 'localhost',
      port: parseInt(process.env.MEDIA_DB_PORT) || 5432,
      username: process.env.MEDIA_DB_USERNAME,
      password: process.env.MEDIA_DB_PASSWORD,
      database: process.env.MEDIA_DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    JwtAuthModule,
    MediaMicroserviceModule,
    MediaModule,
    HealthModule,
  ],
})
export class AppModule {}
