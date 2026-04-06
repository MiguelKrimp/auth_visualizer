import { Center, Separator } from '@chakra-ui/react';

type CommunicationLineProps = {
  x1: string;
  x2: string;
  color: string;
  text?: string;
};

export function CommunicationLine({ x1, x2, color, text }: CommunicationLineProps) {
  return (
    <>
      <Center marginLeft={x1} marginRight={x2} flexDir="column">
        {text}
        <Separator borderColor={color} borderWidth="2px" orientation="horizontal" width="100%" />
      </Center>
    </>
  );
}
