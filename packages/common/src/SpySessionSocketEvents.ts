import { SpySessionConfig } from './SpySessionConfig';

export interface ServerToClientEvents {
  sessionId: (sessionId: string) => void;
  pause: (data: { name: string; data: any }) => void;
}

export interface ClientToServerEvents {
  config: (config: Partial<SpySessionConfig>) => void;
  resume: (name: string) => void;
}
