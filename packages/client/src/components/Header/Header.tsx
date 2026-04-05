import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';

import { SpySessionControl } from './SpySessionControl';

export function Header() {
  return (
    <Flex
      as="header"
      borderWidth="1px"
      borderColor="line"
      bg="surface"
      borderRadius="xl"
      px={{ base: 4, md: 6 }}
      py={4}
      align="center"
      justify="space-between"
      boxShadow="0 0 0 1px rgba(57, 255, 20, 0.08), 0 0 40px rgba(57, 255, 20, 0.09)"
    >
      <Box>
        <Heading
          size="lg"
          color="bright"
          fontFamily="mono"
          letterSpacing="0.08em"
          textTransform="uppercase"
        >
          Auth Visualizer
        </Heading>
        <Text color="muted" fontSize="sm" mt={1}>
          Simulate and inspect authentication flows.
        </Text>
      </Box>
      <SpySessionControl />
    </Flex>
  );
}
