import { NestFactory } from '@nestjs/core';
import { ValidationPipe, INestApplication } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { HttpExceptionFilter } from '../filters/http-exception.filter';
import * as cookieParser from 'cookie-parser';

export interface BootstrapConfig {
  port: number;
  serviceName: string;
  enableValidation?: boolean;
  enableHttpExceptionFilter?: boolean;
  enableCookieParser?: boolean;
  globalPrefix?: string;
}

export interface MicroserviceBootstrapConfig {
  serviceName: string;
  rabbitmqUrl?: string;
  queueName?: string;
  queueOptions?: {
    durable?: boolean;
  };
}

export class BootstrapUtils {
  /**
   * Create and configure HTTP application with common settings
   */
  static async createHttpApp<T>(
    appModule: any,
    config: BootstrapConfig
  ): Promise<INestApplication> {
    const app = await NestFactory.create<NestExpressApplication>(appModule);

    // Global validation pipe
    if (config.enableValidation !== false) {
      app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          transform: true,
          transformOptions: { enableImplicitConversion: true },
        })
      );
    }

    // Global exception filter
    if (config.enableHttpExceptionFilter !== false) {
      app.useGlobalFilters(new HttpExceptionFilter());
    }


    // Cookie parser
    if (config.enableCookieParser) {
      app.use(cookieParser());
    }

    // Global prefix
    if (config.globalPrefix) {
      app.setGlobalPrefix(config.globalPrefix);
    }

    return app;
  }

  /**
   * Bootstrap HTTP service with common configuration
   */
  static async bootstrapHttpService(
    appModule: any,
    config: BootstrapConfig
  ): Promise<void> {
    const app = await this.createHttpApp(appModule, config);

    // Start HTTP server
    await app.listen(config.port);

    console.log(`🚀 ${config.serviceName} is running on: http://localhost:${config.port}`);
  }

  /**
   * Bootstrap microservice with RabbitMQ configuration
   */
  static async bootstrapMicroservice(
    appModule: any,
    config: MicroserviceBootstrapConfig
  ): Promise<void> {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(appModule, {
      transport: Transport.RMQ,
      options: {
        urls: [config.rabbitmqUrl || process.env.RABBITMQ_URL],
        queue: config.queueName || process.env.USER_PERMISSION_GATEWAY_QUEUE,
        queueOptions: {
          durable: true,
          ...config.queueOptions,
        },
      },
    });

    await app.listen();
    console.log(`🚀 ${config.serviceName} microservice is running`);
  }

}
