import { AppModule } from './app.module';
import { BootstrapUtils } from 'shared-common';

async function bootstrap() {
  // Start HTTP service for health checks
  await BootstrapUtils.bootstrapHttpService(AppModule, {
    port: parseInt(process.env.USER_PERMISSION_GATEWAY_PORT),
    serviceName: '🚀 User Permission Gateway',
  });

  // Start microservice
  await BootstrapUtils.bootstrapMicroservice(AppModule, {
    serviceName: '🚀 User Permission Gateway microservice',
    rabbitmqUrl: process.env.RABBITMQ_URL,
    queueName: process.env.USER_PERMISSION_GATEWAY_QUEUE,
  });
}

bootstrap();
