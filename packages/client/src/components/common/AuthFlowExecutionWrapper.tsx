import { useState } from 'react';

import type { AbstractFlowExecutor } from '../../authflow/executor/AbstractFlowExecutor';
import { AuthFlowExecutionContext } from './AuthFlowExecutionContext';

export function AuthFlowExecutionWrapper(props: React.PropsWithChildren) {
  const [executor, setExecutor] = useState<AbstractFlowExecutor | null>(null);

  return (
    <AuthFlowExecutionContext.Provider value={{ getExecutor: () => executor, setExecutor }}>
      {props.children}
    </AuthFlowExecutionContext.Provider>
  );
}
