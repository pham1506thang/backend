import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { QueueConsumerService } from './queue-consumer.service';

@Module({
  providers: [QueueService, QueueConsumerService],
  exports: [QueueService],
})
export class QueueModule {}
