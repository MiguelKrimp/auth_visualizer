import { Center, Separator } from '@chakra-ui/react';
import type { JSX } from 'react';
import { useEffect, useRef, useState } from 'react';

export type DeviceLineProps = {
  x: string;
  y: string;
  img?: JSX.Element;
  label?: string;
  color: string;
};

export function DeviceLine({ x, y, img, label, color }: DeviceLineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<string>(`calc(100% - ${y})`);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;

    const observer = new ResizeObserver(() => {
      setHeight(`${parent.offsetHeight - el.offsetTop}px`);
    });

    observer.observe(parent);
    return () => observer.disconnect();
  }, []);

  return (
    <Center
      ref={ref}
      flexDir="column"
      justifyContent="start"
      gap="4px"
      position="absolute"
      h={height}
      top={y}
      left={x}
      transform="translate(-50%, 0)"
      bg="transparent"
      color={color}
      transition="height 1s cubic-bezier(.17,.84,.44,1)"
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
