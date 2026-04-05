import { Flex, HStack, IconButton, Link, Text } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { MdSkipNext } from 'react-icons/md';
import { AbstractFlowExecutor } from '../../authflow/executor/AbstractFlowExecutor';
import { AuthFlowExecutionContext } from '../common/AuthFlowExecutionContext';
import { FaGithub } from 'react-icons/fa';

export function Footer() {
  const executionContext = useContext(AuthFlowExecutionContext);
  const [executor, setExecutor] = useState<AbstractFlowExecutor | undefined>(
    executionContext.executor,
  );
  executionContext.listener = setExecutor;

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
      justify="space-between"
      align="center"
      gap={3}
      direction={{ base: 'column', md: 'row' }}
    >
      <Text fontSize="sm" color="muted">
        {/* TODO more info */}
        Status: {executor ? 'flow execution in progress' : 'waiting for flow execution'}
      </Text>
      <IconButton
        bg="accent1"
        color="background"
        disabled={!executor}
        rounded="full"
        onClick={() => executor?.next()}
      >
        <MdSkipNext />
      </IconButton>
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
  );
}
