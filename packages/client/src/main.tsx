import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './main.css';

import App from './App.tsx';
import { ChakraProvider } from '@chakra-ui/react';
import { system } from './theme/green.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider value={system}>
      <App />
    </ChakraProvider>
  </StrictMode>,
);
