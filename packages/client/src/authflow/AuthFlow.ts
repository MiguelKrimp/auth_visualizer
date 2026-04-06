import type { JSX } from 'react';

import type { AbstractFlowExecutor } from './executor/AbstractFlowExecutor';

export type AuthFlow = {
  id: string;
  label: string;
  description: string;
  infoLink: string;
  executorFactory?: (renderCallback: (elements: JSX.Element[]) => void) => AbstractFlowExecutor;
};
