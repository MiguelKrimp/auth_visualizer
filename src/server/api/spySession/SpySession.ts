import { NIL, v4 as uuidV4 } from 'uuid';

import { ValidAuthSteps } from '../../../common/authflow/steps/AuthSteps';
import { LoggingService } from '../../services/LoggingService';

export interface ISpySession<T extends ValidAuthSteps = ValidAuthSteps> {
  id: string;
  step<K extends keyof T>(name: K, data: T[K]['data']): Promise<void>;
}

export class SpySession<T extends ValidAuthSteps> implements ISpySession<T> {
  readonly id: string;

  constructor() {
    this.id = uuidV4();
  }

  async step<K extends keyof T>(name: K, data: T[K]['data']): Promise<void> {
    LoggingService.log(name, data);
    return new Promise((resolve) => setTimeout(resolve, 5000)); // Simulate async work
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
