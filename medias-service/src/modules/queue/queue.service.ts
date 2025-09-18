import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';

export interface MediaProcessingMessage {
  mediaId: string;
  filePath: string;
  originalName: string;
  mimeType: string;
  userId: string;
  processingOptions: {
    generateSizes: boolean;
    sizes: string[];
    quality: number;
    format: string;
  };
}

@Injectable()
export class QueueService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private readonly queueName = 'media_processing';

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    await this.connect();
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

      console.log('✅ Connected to RabbitMQ');
    } catch (error) {
      console.error('❌ Failed to connect to RabbitMQ:', error);
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
      console.log('✅ Disconnected from RabbitMQ');
    } catch (error) {
      console.error('❌ Error disconnecting from RabbitMQ:', error);
    }
  }

  async publishMediaProcessing(
    message: MediaProcessingMessage
  ): Promise<boolean> {
    try {
      const success = this.channel.sendToQueue(
        this.queueName,
        Buffer.from(JSON.stringify(message)),
        {
          persistent: true,
        }
      );

      if (success) {
        console.log(
          `📤 Published media processing message for mediaId: ${message.mediaId}`
        );
      }

      return success;
    } catch (error) {
      console.error('❌ Failed to publish message:', error);
      return false;
    }
  }

  async getQueueStatus() {
    try {
      const queueInfo = await this.channel.checkQueue(this.queueName);
      return {
        queueName: this.queueName,
        messageCount: queueInfo.messageCount,
        consumerCount: queueInfo.consumerCount,
      };
    } catch (error) {
      console.error('❌ Failed to get queue status:', error);
      return null;
    }
  }
}
