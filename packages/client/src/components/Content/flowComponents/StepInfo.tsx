import { Box, CodeBlock, Heading } from '@chakra-ui/react';
import type React from 'react';

type StepInfoProps = {
  stepLabel: string;
  info: Record<string, unknown>;
  style?: React.CSSProperties;
};

export function StepInfo({ stepLabel, info, style }: StepInfoProps) {
  return (
    <div style={{ width: '100%' }}>
      <Box
        position="relative"
        bg="surfaceAlt"
        borderColor="line"
        borderWidth="1px"
        borderRadius="md"
        p={2}
        m={1}
        width="fit-content"
        style={style}
      >
        <Heading size="md">{stepLabel}</Heading>
        <CodeBlock.Root mt={1} code={JSON.stringify(info, undefined, 2)} size="sm" language="json">
          <CodeBlock.Content>
            <CodeBlock.Code>
              <CodeBlock.CodeText p={1} />
            </CodeBlock.Code>
          </CodeBlock.Content>
        </CodeBlock.Root>
      </Box>
    </div>
  );
}
