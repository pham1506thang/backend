import { Injectable } from '@nestjs/common';
import { WebSocketGateway } from './websocket.gateway';

@Injectable()
export class WebSocketService {
  constructor(private webSocketGateway: WebSocketGateway) {}

  notifyMediaProcessingUpdate(
    mediaId: string,
    status: string,
    progress?: number,
    error?: string
  ) {
    this.webSocketGateway.notifyMediaProcessingUpdate(
      mediaId,
      status,
      progress,
      error
    );
  }

  notifyMediaProcessingComplete(
    mediaId: string,
    status: 'completed' | 'failed',
    error?: string
  ) {
    this.webSocketGateway.notifyMediaProcessingUpdate(
      mediaId,
      status,
      100,
      error
    );
  }

  notifyMediaProcessingProgress(mediaId: string, progress: number) {
    this.webSocketGateway.notifyMediaProcessingUpdate(
      mediaId,
      'processing',
      progress
    );
  }
}
