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
  return (
    <Box
      minH="100dvh"
      bg="background"
      color="text"
      display="flex"
      flexDir="column"
      position="relative"
      overflow="hidden"
      backgroundRepeat="repeat"
      backgroundImage={'url("./hackerman.png")'}
      backgroundSize="15%"
      backgroundBlendMode="multiply"
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
