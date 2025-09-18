import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import { MediaProcessingMessage } from './queue.service';
import { MediasService } from '../medias/medias.service';

@Injectable()
export class QueueConsumerService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private readonly queueName = 'media_processing';

  constructor(
    private configService: ConfigService,
    private mediasService: MediasService
  ) {}

  async onModuleInit() {
    await this.connect();
    await this.startConsuming();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async connect() {
    try {
      const rabbitmqUrl = this.configService.get<string>('RABBITMQ_URL');

      this.connection = await amqp.connect(rabbitmqUrl);
      this.channel = await this.connection.createChannel();

      // Declare queue
      await this.channel.assertQueue(this.queueName, {
        durable: true,
      });

      // Set prefetch to 1 to process one message at a time
      await this.channel.prefetch(1);

      console.log('✅ Queue Consumer connected to RabbitMQ');
    } catch (error) {
      console.error('❌ Failed to connect Queue Consumer to RabbitMQ:', error);
      throw error;
    }
  }

  private async disconnect() {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      console.log('✅ Queue Consumer disconnected from RabbitMQ');
    } catch (error) {
      console.error(
        '❌ Error disconnecting Queue Consumer from RabbitMQ:',
        error
      );
    }
  }

  private async startConsuming() {
    try {
      await this.channel.consume(this.queueName, async msg => {
        if (msg) {
          try {
            const message: MediaProcessingMessage = JSON.parse(
              msg.content.toString()
            );
            console.log(`📥 Processing media: ${message.mediaId}`);

            // Process the media
            await this.processMedia(message);

            // Acknowledge the message
            this.channel.ack(msg);
            console.log(`✅ Completed processing media: ${message.mediaId}`);
          } catch (error) {
            console.error(`❌ Error processing media:`, error);

            // Reject the message and requeue it
            this.channel.nack(msg, false, true);
          }
        }
      });

      console.log('🔄 Started consuming messages from queue');
    } catch (error) {
      console.error('❌ Failed to start consuming:', error);
      throw error;
    }
  }

  private async processMedia(message: MediaProcessingMessage) {
    try {
      // Update status to processing
      await this.mediasService.updateProcessingStatus(
        message.mediaId,
        'processing'
      );

      // Process the media (image processing, etc.)
      await this.mediasService.processMediaFile(message);

      // Update status to completed
      await this.mediasService.updateProcessingStatus(
        message.mediaId,
        'completed'
      );

      // Notify via WebSocket
      await this.mediasService.notifyProcessingComplete(
        message.mediaId,
        'completed'
      );
    } catch (error) {
      console.error(`❌ Error processing media ${message.mediaId}:`, error);

      // Update status to failed
      await this.mediasService.updateProcessingStatus(
        message.mediaId,
        'failed'
      );

      // Notify via WebSocket
      await this.mediasService.notifyProcessingComplete(
        message.mediaId,
        'failed',
        error.message
      );

      throw error;
    }
  }
}
