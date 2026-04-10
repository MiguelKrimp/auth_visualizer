import { create } from 'zustand';

import { AbstractFlowExecutor } from '../../authflow/executor/AbstractFlowExecutor';

export enum FlowState {
  Idle,
  Running,
  Completed,
  Failed,
}

export type ExecutionContext = {
  executorFactory: (() => AbstractFlowExecutor) | null;
  initialize: (factory: () => AbstractFlowExecutor) => void;
  flowState: FlowState;
  executor: AbstractFlowExecutor | null;
  startExecution: () => Promise<void>;
  abortExecution: () => Promise<void>;
};

export const useFlowExecutorStore = create<ExecutionContext>((set, get) => ({
  executorFactory: null,
  initialize: (factory) => set({ executorFactory: factory }),
  flowState: FlowState.Idle,

  executor: null,
  startExecution: async () => {
    const factory = get().executorFactory;
    if (!factory) {
      return;
    }
    const executor = factory();
    set({ executor, flowState: FlowState.Running });
    return executor
      .execute()
      .then(() => {
        set({ flowState: FlowState.Completed });
      })
      .catch(() => {
        set({ flowState: FlowState.Failed });
      });
  },
  abortExecution: async () => {
    const executor = get().executor;
    if (!executor) {
      return;
    }
    return executor.abort().finally(() => {
      set({ flowState: FlowState.Idle, executor: null });
    });
  },
}));
