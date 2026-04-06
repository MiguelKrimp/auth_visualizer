import { createContext } from 'react';

import { AbstractFlowExecutor } from '../../authflow/executor/AbstractFlowExecutor';

export type ExecutionContext = {
  getExecutor: () => AbstractFlowExecutor | null;
  setExecutor: (executor: AbstractFlowExecutor | null) => void;
};

export const AuthFlowExecutionContext = createContext<ExecutionContext>({
  getExecutor: () => null,
  setExecutor: () => {},
});
