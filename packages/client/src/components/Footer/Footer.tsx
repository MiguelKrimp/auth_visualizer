import { Flex, HStack, IconButton, Link, Text } from '@chakra-ui/react';
import { useContext } from 'react';
import { FaGithub } from 'react-icons/fa';
import { MdRefresh, MdSkipNext } from 'react-icons/md';

import { AuthFlowExecutionContext } from '../common/AuthFlowExecutionContext';

export function Footer() {
  const executionContext = useContext(AuthFlowExecutionContext);

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
          {/* TODO more info */}
          Status:{' '}
          {executionContext.getExecutor()
            ? 'flow execution in progress'
            : 'waiting for flow execution'}
        </Text>
      </Flex>
      <Flex flex={{ base: 'unset', md: 1 }} gap={4} justify="center">
        <IconButton
          bg="accent1"
          color="background"
          disabled={!executionContext.getExecutor()}
          rounded="full"
          onClick={() => {
            executionContext
              .getExecutor()
              ?.abort()
              .finally(() => {
                executionContext.setExecutor(null);
              });
          }}
        >
          <MdRefresh />
        </IconButton>
        <IconButton
          bg="accent1"
          color="background"
          disabled={!executionContext.getExecutor()}
          rounded="full"
          onClick={() => executionContext.getExecutor()?.next()}
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
