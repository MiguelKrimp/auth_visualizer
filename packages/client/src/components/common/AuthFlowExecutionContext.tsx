import { createContext } from 'react';
import { AbstractFlowExecutor } from '../../authflow/executor/AbstractFlowExecutor';

export class ExecutionContext {
  private _executor?: AbstractFlowExecutor;
  listener?: (executor: AbstractFlowExecutor) => void;

  set executor(executor: AbstractFlowExecutor) {
    this._executor = executor;
    if (this.listener) {
      this.listener(executor);
    }
  }

  get executor(): AbstractFlowExecutor | undefined {
    return this._executor;
  }
}

export const AuthFlowExecutionContext = createContext<ExecutionContext>(new ExecutionContext());
