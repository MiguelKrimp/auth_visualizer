import { Box, Container } from '@chakra-ui/react';

import { AuthFlowExecutionWrapper } from './components/common/AuthFlowExecutionWrapper';
import { AuthSelection } from './components/Content/AuthSelection';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';

function App() {
  return (
    <Box
      h="100dvh"
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
        minH="0"
        overflow="hidden"
        position="relative"
        zIndex={1}
      >
        <Header />
        <AuthFlowExecutionWrapper>
          <AuthSelection />
          <Footer />
        </AuthFlowExecutionWrapper>
      </Container>
    </Box>
  );
}

export default App;
