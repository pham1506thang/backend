import { AppModule } from './app.module';
import { BootstrapUtils, QUEUE_NAMES } from 'shared-common';

async function bootstrap() {
  // Start HTTP service
  await BootstrapUtils.bootstrapHttpService(AppModule, {
    port: parseInt(process.env.MAIN_SERVICE_PORT),
    serviceName: '🏢 Main Service (CMS)',
  });

  // Start microservice
  await BootstrapUtils.bootstrapMicroservice(AppModule, {
    serviceName: 'Main Service Microservice',
    queueName: QUEUE_NAMES.MAIN_SERVICE_QUEUE,
  });
}

bootstrap();
