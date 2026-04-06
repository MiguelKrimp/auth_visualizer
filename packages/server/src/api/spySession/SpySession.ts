import { ValidAuthSteps } from '@auth-visualizer/common/authflow/steps/AuthSteps';
import { StepIDs } from '@auth-visualizer/common/authflow/steps/StepIDs';
import { SpySessionConfig } from '@auth-visualizer/common/SpySessionConfig';
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@auth-visualizer/common/SpySessionSocketEvents';
import { Socket } from 'socket.io';
import { NIL, v4 as uuidV4 } from 'uuid';

import { LoggingService } from '../../services/LoggingService';

export interface ISpySession<T extends ValidAuthSteps = ValidAuthSteps> {
  id: string;
  step<K extends keyof T>(name: K, data: T[K]['data']): Promise<void>;
}

type SpySocket = Socket<ClientToServerEvents, ServerToClientEvents>;

export class SpySession<T extends ValidAuthSteps> implements ISpySession<T> {
  readonly id: string;

  private readonly socket: SpySocket;
  private config = new SpySessionConfig();

  constructor(socket: SpySocket) {
    this.id = uuidV4();
    this.socket = socket;
    this.socket.emit('sessionId', this.id);
    this.initializeConfig();
  }

  onDisconnect(callback: () => void): void {
    this.socket.on('disconnect', () => {
      LoggingService.instance.info(`Spy session disconnected: ${this.id}`);
      callback();
    });
  }

  initializeConfig(): void {
    this.socket.on('config', (config: Partial<SpySessionConfig>) => {
      this.config = { ...this.config, ...config };
    });
  }

  destroy(): void {
    this.socket.disconnect(true);
  }

  async step<K extends keyof T>(name: K, data: T[K]['data']): Promise<void> {
    if (!this.config.doSpy) {
      return;
    }
    const stepName = String(name) as StepIDs;

    this.socket.emit('pause', { name: stepName, data });

    let timeoutHandler: NodeJS.Timeout;
    return new Promise<void>((resolve, reject) => {
      this.socket.once('resume', (name: StepIDs) => {
        if (name === stepName) {
          resolve();
        }
      });

      this.socket.once('abort', () => {
        reject(new Error(`Flow aborted by client`));
      });

      timeoutHandler = setTimeout(
        () => {
          LoggingService.instance.warn(`Spy session ${this.id} timed out during step ${stepName}`);
          resolve();
        },
        1000 * 60 * 5,
      );
    }).finally(() => {
      clearTimeout(timeoutHandler);
      this.socket.removeAllListeners('abort');
      this.socket.removeAllListeners('resume');
    });
  }
}

export class NOOPSpySession<T extends ValidAuthSteps> implements ISpySession<T> {
  readonly id: string;

  constructor() {
    this.id = NIL;
  }

  async step<K extends keyof T>(_name: K, _data: T[K]['data']): Promise<void> {
    // ! Do nothing
  }
}
