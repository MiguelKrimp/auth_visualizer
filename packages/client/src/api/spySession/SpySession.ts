import {
  type ClientToServerEvents,
  type ServerToClientEvents,
  SpySessionConfig,
} from '@auth-visualizer/common';
import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';

export type SpyingSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export class SpySession {
  private websocket: SpyingSocket;
  readonly sessionId: string;

  private config = new SpySessionConfig();

  private currentStep?: string | undefined;

  private static instance?: Promise<SpySession>;
  static async get(): Promise<SpySession> {
    if (!SpySession.instance) {
      SpySession.instance = new Promise<SpySession>((resolve, reject) => {
        const socket = io('http://localhost:3000/spy', {
          transports: ['websocket', 'polling'],
        });
        socket.on('sessionId', (sessionId) => {
          resolve(new SpySession(sessionId, socket));
        });
        socket.on('connect_error', (err) => {
          reject(err);
        });
      });
    }
    return SpySession.instance;
  }

  private constructor(sessionId: string, socket: SpyingSocket) {
    this.sessionId = sessionId;
    this.websocket = socket;
  }

  get doSpy() {
    return this.config.doSpy;
  }

  set doSpy(value: boolean) {
    this.config.doSpy = value;
    this.websocket.emit('config', this.config);
  }

  onPause(infoCallback: (name: string, info: any) => void): void {
    this.websocket.on('pause', ({ name, data }) => {
      this.currentStep = name;
      infoCallback(name, data);
    });
  }

  resume() {
    if (this.currentStep) {
      this.websocket.emit('resume', this.currentStep);
      this.currentStep = undefined;
    }
  }

  disconnect() {
    this.websocket.disconnect();
  }
}
