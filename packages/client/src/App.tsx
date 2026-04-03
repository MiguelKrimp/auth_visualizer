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
import { Header } from './components/Header/Header';
import { FlowContent } from './components/Content/FlowContent';
import { Footer } from './components/Footer/Footer';

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
        <Header />
        <FlowContent />
        <Footer />
      </Container>
    </Box>
  );
}

export default App;
