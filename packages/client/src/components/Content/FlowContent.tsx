import { Box, HStack, Heading, Separator, Tabs, Text } from '@chakra-ui/react';

const flows = [
  {
    label: 'Basic',
  },
  {
    label: 'Simple JWT',
  },
  {
    label: '2FA',
  },
  {
    label: 'OIDC',
  },
  {
    label: 'WebAuthn',
  },
];

export function FlowContent() {
  return (
    <Box
      as="main"
      mt={{ base: 5, md: 6 }}
      flex="1"
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

      <Tabs.Root variant="outline" defaultValue={flows[0]?.label} fitted>
        <Tabs.List bg="surface" borderColor="line" p={1} borderRadius="lg" gapX="1">
          {flows.map((flow) => (
            <Tabs.Trigger
              key={flow.label}
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
              {flow.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </Tabs.Root>
    </Box>
  );
}
