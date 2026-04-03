import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

export const greenTheme = defineConfig({
  theme: {
    tokens: {
      colors: {
        primary: { value: '#a6e22ea1' },
        bright: { value: '#39ff14' },
        accent1: { value: '#66d9ef' },
        accent2: { value: '#fd971f' },
        text: { value: '#e6edf3' },
        muted: { value: '#9aa5b1' },
        background: { value: '#0f1115' },
        surface: { value: '#161b22' },
        surfaceAlt: { value: '#1f2631' },
        panel: { value: '#121821' },
        line: { value: '#21e20c35' },
      },
      fonts: {
        mono: { value: 'JetBrains Mono, monospace, system-ui' },
      },
    },
  },
});

export const system = createSystem(defaultConfig, greenTheme);
