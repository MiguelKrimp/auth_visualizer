import { Flex, Text } from '@chakra-ui/react';

export function Footer() {
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
      gap={3}
      direction={{ base: 'column', md: 'row' }}
    >
      <Text fontSize="sm" color="muted">
        Status: waiting for flow execution
      </Text>
      <Text fontSize="sm" fontFamily="mono" color="accent2">
        auth-visualizer v1.0
      </Text>
    </Flex>
  );
}
