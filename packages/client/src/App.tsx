import {
  Badge,
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  Separator,
  Tabs,
  Text,
} from '@chakra-ui/react';
import type { CSSProperties, PointerEvent } from 'react';

const flows = [
  {
    label: 'Basic',
  },
  {
    label: 'Simple JWT',
  },
  {
    label: 'OIDC',
  },
  {
    label: 'WebAuthn',
  },
];

function App() {
  const updateGlowPosition = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    event.currentTarget.style.setProperty('--cursor-x', `${x}px`);
    event.currentTarget.style.setProperty('--cursor-y', `${y}px`);
  };

  const showGlow = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty('--glow-alpha', '0.22');
    updateGlowPosition(event);
  };

  const hideGlow = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty('--glow-alpha', '0');
  };

  const glowVars = {
    '--cursor-x': '50%',
    '--cursor-y': '50%',
    '--glow-alpha': '0',
  } as CSSProperties;

  return (
    <Box
      minH="100dvh"
      bg="background"
      color="text"
      display="flex"
      flexDir="column"
      position="relative"
      overflow="hidden"
      onPointerMove={updateGlowPosition}
      onPointerEnter={showGlow}
      onPointerLeave={hideGlow}
      style={glowVars}
      backgroundImage="radial-gradient(128px circle at var(--cursor-x) var(--cursor-y), rgba(57,255,20,var(--glow-alpha)) 0%, rgba(57,255,20,calc(var(--glow-alpha) * 0.4)) 36%, rgba(57,255,20,0) 70%)"
      backgroundRepeat="no-repeat"
      transition="background 180ms ease-out"
    >
      <Container
        maxW="90rem"
        w="100%"
        py={{ base: 4, md: 6 }}
        display="flex"
        flexDir="column"
        flex="1"
        position="relative"
        zIndex={1}
      >
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
          <Badge
            colorPalette="green"
            variant="surface"
            px={3}
            py={1}
            borderRadius="full"
            fontFamily="mono"
            letterSpacing="0.04em"
          >
            SESSION: LOCAL
          </Badge>
        </Flex>

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
              Flow Selection
            </Heading>
            <Text fontSize="sm" color="muted">
              Tab content placeholder for now
            </Text>
          </HStack>

          <Separator borderColor="line" mb={4} />

          <Tabs.Root variant="outline" defaultValue={flows[0]?.label} fitted>
            <Tabs.List bg="surface" borderColor="line" p={1} borderRadius="lg">
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
            auth-visualizer v0.1
          </Text>
        </Flex>
      </Container>
    </Box>
  );
}

export default App;
