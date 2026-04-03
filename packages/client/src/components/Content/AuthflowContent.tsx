import { Box } from '@chakra-ui/react';
import { useRef, useState, useLayoutEffect } from 'react';

type AuthflowContentProps = {
  flow: {
    label: string;
  };
};

const leftX = '30%';
const rightX = '70%';

export function AuthflowContent({ flow }: AuthflowContentProps) {
  const contentRef = useRef<SVGGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [svgSize, setSvgSize] = useState({ width: 800, height: 100 });
  useLayoutEffect(() => {
    console.log(contentRef.current, containerRef.current);
    if (!contentRef.current || !containerRef.current) {
      return;
    }

    const bounds = contentRef.current.getBBox();

    console.log(bounds);

    const padding = 24;
    const nextWidth = containerRef.current.clientWidth - padding;
    const nextHeight = Math.max(100, Math.ceil(bounds.y + bounds.height + padding));

    setSvgSize({ width: nextWidth, height: nextHeight });
  }, []);

  return (
    <Box
      ref={containerRef}
      flex="1"
      minH="0"
      w="100%"
      bg="surface"
      borderColor="line"
      borderWidth={1}
      borderRadius="md"
      overflow="auto"
      p={3}
    >
      <svg
        width={svgSize.width}
        height={svgSize.height}
        viewBox={`0 0 ${svgSize.width} ${svgSize.height}`}
        style={{
          display: 'block',
          minWidth: '100%',
        }}
      >
        <g ref={contentRef}>
          <g>
            <image x={`calc(${leftX} - 20px)`} y={5} height={40} width={40} href="./desktop.svg" />
            <line stroke="darkgreen" strokeWidth={5} x1={leftX} y1={50} x2={leftX} y2="99%" />
            <image x={`calc(${rightX} - 20px)`} y={5} height={40} width={40} href="./server.svg" />
            <line stroke="orange" strokeWidth={5} x1={rightX} y1={50} x2={rightX} y2="99%" />
          </g>
        </g>
      </svg>
    </Box>
  );
}
