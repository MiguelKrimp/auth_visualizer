import { Box, Button } from '@chakra-ui/react';
import { type JSX, useContext, useEffect, useRef, useState } from 'react';

import type { AuthFlow } from '../../authflow/AuthFlow';
import { AuthFlowExecutionContext } from '../common/AuthFlowExecutionContext';

type AuthflowContentProps = {
  flow: AuthFlow;
};

export function AuthflowContent({ flow }: AuthflowContentProps) {
  const [flowElements, setFlowElements] = useState<JSX.Element[] | null>(null);

  const drawingAreaRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (drawingAreaRef.current) {
      const last = drawingAreaRef.current.lastChild as HTMLElement | null;
      last?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [flowElements]);

  const executionContext = useContext(AuthFlowExecutionContext);

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
        {executionContext.getExecutor() ? flowElements : null}
      </div>
      {!executionContext.getExecutor() ? (
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
              if (flow.executorFactory) {
                const exec = flow.executorFactory(setFlowElements);
                executionContext.setExecutor(exec);
                exec.execute();
              }
            }}
          >
            Start Auth flow
          </Button>
        </Box>
      ) : null}
    </Box>
  );
}
