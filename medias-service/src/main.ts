import { AppModule } from './app.module';
import { BootstrapUtils } from 'shared-common';

async function bootstrap() {
  await BootstrapUtils.bootstrapHttpService(AppModule, {
    port: parseInt(process.env.MEDIAS_SERVICE_PORT),
    serviceName: '🚀 Medias Service',
    globalPrefix: 'api/medias',
    enableHttpExceptionFilter: false, // Medias service doesn't use HttpExceptionFilter
  });

  console.log(`📊 RabbitMQ Management: http://localhost:15672`);
}

bootstrap();
