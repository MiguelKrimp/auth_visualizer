import { Flex, HStack, IconButton, Link, Text } from '@chakra-ui/react';
import { useMemo } from 'react';
import { FaGithub } from 'react-icons/fa';
import { MdRefresh, MdSkipNext } from 'react-icons/md';
import { useShallow } from 'zustand/shallow';

import { FlowState, useFlowExecutorStore } from '../common/AuthFlowExecutionContext';

export function Footer() {
  const { flowState, executor, startExecution } = useFlowExecutorStore(
    useShallow((state) => ({
      flowState: state.flowState,
      executor: state.executor,
      startExecution: state.startExecution,
    })),
  );

  const { flowStatus, flowColor } = useMemo(() => {
    switch (flowState) {
      case FlowState.Running:
        return { flowStatus: 'flow execution in progress', flowColor: 'accent1' };
      case FlowState.Completed:
        return { flowStatus: 'flow execution completed', flowColor: 'bright' };
      case FlowState.Failed:
        return { flowStatus: 'flow execution failed or aborted', flowColor: 'red.500' };
      default:
        return { flowStatus: 'waiting for flow execution', flowColor: 'gray.500' };
    }
  }, [flowState]);

  return (
    <Flex
      as="footer"
      mt={{ base: 5, md: 6 }}
      borderWidth="1px"
      borderColor="line"
      bg="surface"
      borderRadius="xl"
      px={{ base: 4, md: 6 }}
      py={3}
      align="center"
      gap={3}
      direction={{ base: 'column', md: 'row' }}
    >
      <Flex flex={{ base: 'unset', md: 1 }} justify={{ base: 'center', md: 'flex-start' }}>
        <Text fontSize="sm" color="muted" textAlign={{ base: 'center', md: 'left' }}>
          Status:{' '}
          <Text color={flowColor} as="span" fontWeight="bold">
            {flowStatus}
          </Text>
        </Text>
      </Flex>
      <Flex flex={{ base: 'unset', md: 1 }} gap={4} justify="center">
        <IconButton
          bg="accent1"
          color="background"
          disabled={!executor}
          rounded="full"
          onClick={() => {
            startExecution();
          }}
        >
          <MdRefresh />
        </IconButton>
        <IconButton
          bg="accent1"
          color="background"
          disabled={!executor}
          rounded="full"
          onClick={() => executor?.next()}
        >
          <MdSkipNext />
        </IconButton>
      </Flex>
      <Flex flex={{ base: 'unset', md: 1 }} justify={{ base: 'center', md: 'flex-end' }}>
        <HStack>
          <Text fontSize="sm" fontFamily="mono" color="accent2">
            auth-visualizer v1.0
          </Text>
          <Link
            color="text"
            href="https://github.com/MiguelKrimp/auth_visualizer"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub />
          </Link>
        </HStack>
      </Flex>
    </Flex>
  );
}
