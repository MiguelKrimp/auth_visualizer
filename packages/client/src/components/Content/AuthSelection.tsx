import { Box, Heading, HStack, Separator, Tabs, Text } from '@chakra-ui/react';
import { useShallow } from 'zustand/shallow';

import { flows } from '../../authflow/Flows';
import { useFlowExecutorStore } from '../common/AuthFlowExecutionContext';
import { AuthflowContent } from './AuthflowContent';
import { Tab } from './Tab';

export function AuthSelection() {
  const executionContext = useFlowExecutorStore(
    useShallow((state) => ({ abortExecution: state.abortExecution })),
  );

  return (
    <Box
      as="main"
      mt={{ base: 5, md: 6 }}
      flex="1"
      minH="0"
      display="flex"
      flexDir="column"
      overflow="hidden"
      borderWidth="1px"
      borderColor="line"
      bg="panel"
      borderRadius="xl"
      p={{ base: 4, md: 6 }}
      boxShadow="0 0 0 1px rgba(102, 217, 239, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.03)"
    >
      <HStack justify="space-between" mb={4}>
        <Heading size="md" fontFamily="mono" color="accent1">
          Auth Selection
        </Heading>
        <Text fontSize="sm" color="muted">
          Select an auth flow, follow the instructions, and iterate through each step to learn how
          the flow works.
        </Text>
      </HStack>

      <Separator borderColor="line" mb={4} />

      <Tabs.Root
        variant="outline"
        defaultValue={flows[0]?.label}
        fitted
        display="flex"
        flexDir="column"
        flex="1 1 100%"
        minH="0"
        overflow="hidden"
        lazyMount
        onValueChange={() => {
          executionContext.abortExecution();
        }}
      >
        <Tabs.List bg="surface" p={0} borderRadius="lg" gapX="1">
          {flows.map((flow) => (
            <Tabs.Trigger
              key={flow.label}
              disabled={!flow.executorFactory}
              value={flow.label}
              color="text"
              _hover={{ bg: 'surfaceAlt', color: 'bright' }}
              _selected={{
                bg: 'surfaceAlt',
                color: 'bright',
                borderColor: 'accent1',
                boxShadow: 'inset 0 -2px 0 #66d9ef',
              }}
            >
              <Tab key={flow.id} flow={flow} />
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        {flows.map((flow) => (
          <Tabs.Content
            key={flow.id}
            value={flow.label}
            flex="1 1 100%"
            minH="0"
            pt={4}
            display="flex"
            overflow="hidden"
          >
            <AuthflowContent key={flow.id} flow={flow} />
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </Box>
  );
}
