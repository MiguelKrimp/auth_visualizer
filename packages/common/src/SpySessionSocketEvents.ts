import { StepIDs } from './authflow/steps/StepIDs';
import { SpySessionConfig } from './SpySessionConfig';

export interface ServerToClientEvents {
  sessionId: (sessionId: string) => void;
  pause: (data: { name: StepIDs; data: any }) => void;
}

export interface ClientToServerEvents {
  config: (config: Partial<SpySessionConfig>) => void;
  resume: (name: StepIDs) => void;
  abort: () => void;
}
