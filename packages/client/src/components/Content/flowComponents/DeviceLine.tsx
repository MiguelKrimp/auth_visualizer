import { Center, Separator } from '@chakra-ui/react';
import type { JSX } from 'react';

export type DeviceLineProps = {
  x: string;
  y: string;
  img: JSX.Element;
  label: string;
  color: string;
};

export function DeviceLine({ x, y, img, label, color }: DeviceLineProps) {
  return (
    <Center
      flexDir="column"
      justifyContent="start"
      gap="4px"
      position="absolute"
      h={`calc(100% - ${y})`}
      top={y}
      left={x}
      transform="translate(-50%, 0)"
      bg="transparent"
      color={color}
    >
      {label}
      {img}
      <Separator
        borderColor={color}
        borderWidth="2px"
        orientation="vertical"
        minH="100px"
        flex="1 1 0%"
      />
    </Center>
  );
}
