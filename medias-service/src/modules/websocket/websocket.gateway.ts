import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebSocketService } from './websocket.service';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class WebSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private webSocketService: WebSocketService) {}

  handleConnection(client: Socket) {
    console.log(`🔌 Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`🔌 Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_media_processing')
  handleJoinMediaProcessing(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { mediaId: string; userId: string }
  ) {
    const room = `media_processing_${data.mediaId}`;
    client.join(room);
    console.log(`👤 Client ${client.id} joined room: ${room}`);
  }

  @SubscribeMessage('leave_media_processing')
  handleLeaveMediaProcessing(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { mediaId: string }
  ) {
    const room = `media_processing_${data.mediaId}`;
    client.leave(room);
    console.log(`👤 Client ${client.id} left room: ${room}`);
  }

  // Method to notify clients about processing updates
  notifyMediaProcessingUpdate(
    mediaId: string,
    status: string,
    progress?: number,
    error?: string
  ) {
    const room = `media_processing_${mediaId}`;
    this.server.to(room).emit('media_processing_update', {
      mediaId,
      status,
      progress,
      error,
      timestamp: new Date().toISOString(),
    });
  }
}
