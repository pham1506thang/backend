import { AppModule } from './app.module';
import { BootstrapUtils } from 'shared-common';

async function bootstrap() {
  await BootstrapUtils.bootstrapHttpService(AppModule, {
    port: parseInt(process.env.MEDIA_SERVICE_PORT),
    serviceName: '🚀 Media Service'
  });

  console.log(`📊 RabbitMQ Management: http://localhost:15672`);
}

bootstrap();
