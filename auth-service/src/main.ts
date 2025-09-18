import { AppModule } from './app.module';
import { BootstrapUtils } from 'shared-common';

async function bootstrap() {
  await BootstrapUtils.bootstrapHttpService(AppModule, {
    port: parseInt(process.env.AUTH_SERVICE_PORT),
    serviceName: '🔐 Auth Service',
    enableCookieParser: true,
  });
}

bootstrap();
