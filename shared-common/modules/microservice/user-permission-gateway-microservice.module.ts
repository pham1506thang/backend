import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SERVICE_NAMES, QUEUE_NAMES } from '../../constants/message-queue';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: SERVICE_NAMES.USER_PERMISSION_GATEWAY,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: QUEUE_NAMES.USER_PERMISSION_GATEWAY_QUEUE,
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class UserPermissionGatewayMicroserviceModule {}
