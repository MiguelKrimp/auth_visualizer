import { Center, CodeBlock, Icon, Separator } from '@chakra-ui/react';
import { CiMail } from 'react-icons/ci';

import { Tooltip } from '../../common/Tooltip';

type CommunicationLineProps = {
  x1: string;
  x2: string;
  color: string;
  text?: string;
  msgData?: any;
};

export function CommunicationLine({ x1, x2, color, text, msgData }: CommunicationLineProps) {
  return (
    <>
      <Center marginLeft={x1} marginRight={x2} flexDir="column">
        <Center flexDir="row" gap={2} marginLeft={2} marginRight={2}>
          {text}
          {msgData && (
            <Tooltip
              content={
                <CodeBlock.Root
                  mt={1}
                  maxH="30vh"
                  maxW="50vw"
                  overflow="auto"
                  code={JSON.stringify(msgData, undefined, 2)}
                  size="sm"
                  language="json"
                >
                  <CodeBlock.Content>
                    <CodeBlock.Code>
                      <CodeBlock.CodeText p={1} />
                    </CodeBlock.Code>
                  </CodeBlock.Content>
                </CodeBlock.Root>
              }
            >
              <Icon color={color} size="md">
                <CiMail />
              </Icon>
            </Tooltip>
          )}
        </Center>
        <Separator borderColor={color} borderWidth="2px" orientation="horizontal" width="100%" />
      </Center>
    </>
  );
}
