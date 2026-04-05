import { Box } from '@chakra-ui/react';
import { useContext, useLayoutEffect, useMemo, useRef, useState, type JSX } from 'react';

import type { AuthFlow } from '../../authflow/AuthFlow';
import { AuthFlowExecutionContext } from '../common/AuthFlowExecutionContext';

type AuthflowContentProps = {
  flow: AuthFlow;
};

export function AuthflowContent({ flow }: AuthflowContentProps) {
  const contentRef = useRef<SVGGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [svgContent, setSvgContent] = useState<JSX.Element | null>(null);

  const executionContext = useContext(AuthFlowExecutionContext);
  const executor = useMemo(() => {
    if (!flow.executorFactory) {
      return null;
    }

    const exec = flow.executorFactory(setSvgContent);
    executionContext.executor = exec;
    return exec;
  }, [flow]);

  const [svgSize, setSvgSize] = useState({ width: 800, height: 100 });
  useLayoutEffect(() => {
    if (!contentRef.current || !containerRef.current) {
      return;
    }

    const bounds = contentRef.current.getBBox();

    const padding = 24;
    const nextWidth = containerRef.current.clientWidth - padding;
    const nextHeight = Math.max(100, Math.ceil(bounds.y + bounds.height + padding));

    setSvgSize({ width: nextWidth, height: nextHeight });
  }, [svgContent]);

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
        <g ref={contentRef}>{svgContent}</g>
      </svg>
    </Box>
  );
}
