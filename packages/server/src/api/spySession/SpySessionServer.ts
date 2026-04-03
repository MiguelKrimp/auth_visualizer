import { Server } from 'node:http';

import {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@auth-visualizer/common/SpySessionSocketEvents';
import { Server as SocketIOServer } from 'socket.io';

import { LoggingService } from '../../services/LoggingService';
import { SpySessionBroker } from './SpySessionBroker';

type SpySocketServer = SocketIOServer<ClientToServerEvents, ServerToClientEvents>;

export class SpySessionServer {
  ioServer: SpySocketServer;

  constructor(server: Server) {
    this.ioServer = new SocketIOServer<ClientToServerEvents, ServerToClientEvents>(server, {});
    this.ioServer.engine.on('connection_error', (err) => {
      LoggingService.instance.error('WebSocket connection error:', err);
    });
  }

  initialize(): void {
    const spyNS = this.ioServer.of('/spy');
    spyNS.on('connection', (socket) => {
      const session = SpySessionBroker.getInstance().createSession(socket);
      LoggingService.instance.info(`New spy session connected: ${session.id}`);
    });
    LoggingService.instance.info('Spy session websocket initialized on /spy');
  }
}
