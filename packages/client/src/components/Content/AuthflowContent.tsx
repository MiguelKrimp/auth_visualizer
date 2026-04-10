import { Box, Button } from '@chakra-ui/react';
import { type JSX, useEffect, useRef, useState } from 'react';
import { useShallow } from 'zustand/shallow';

import type { AuthFlow } from '../../authflow/AuthFlow';
import { useFlowExecutorStore } from '../common/AuthFlowExecutionContext';

type AuthflowContentProps = {
  flow: AuthFlow;
};

export function AuthflowContent({ flow }: AuthflowContentProps) {
  const { executor, startExecution, initialize } = useFlowExecutorStore(
    useShallow((state) => ({
      executor: state.executor,
      startExecution: state.startExecution,
      initialize: state.initialize,
    })),
  );

  const [flowElements, setFlowElements] = useState<JSX.Element[] | null>(null);

  const drawingAreaRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (drawingAreaRef.current) {
      const last = drawingAreaRef.current.lastChild?.lastChild as HTMLElement | null;
      last?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [flowElements]);

  return (
    <Box
      flex="1"
      h="100%"
      minH="0"
      w="100%"
      bg="surface"
      borderColor="line"
      borderWidth={1}
      borderRadius="md"
      overflow="auto"
      p={3}
      position="relative"
    >
      <div ref={drawingAreaRef} style={{ position: 'relative', minHeight: '100%' }}>
        {executor ? flowElements : null}
      </div>
      {!executor && flow.executorFactory ? (
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          color="accent2"
        >
          <Button
            variant="ghost"
            bg="accent1"
            color="background"
            onClick={() => {
              initialize(() => flow.executorFactory!(setFlowElements));
              startExecution();
            }}
          >
            Start Auth flow
          </Button>
        </Box>
      ) : null}
    </Box>
  );
}
