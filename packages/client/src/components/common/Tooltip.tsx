import { HoverCard, Portal } from '@chakra-ui/react';
import * as React from 'react';

interface TooltipProps extends HoverCard.RootProps {
  content: React.ReactNode;
  contentProps?: HoverCard.ContentProps;
  disabled?: boolean;
}

function Tooltip(props: TooltipProps) {
  const { children, disabled, content, contentProps, ...rest } = props;

  if (disabled) return children;

  return (
    <HoverCard.Root size="sm" {...rest}>
      <HoverCard.Trigger asChild>{children}</HoverCard.Trigger>
      <Portal>
        <HoverCard.Positioner>
          <HoverCard.Content
            {...contentProps}
            bg="surfaceAlt"
            color="text"
            borderColor="line"
            borderWidth="1px"
            boxShadow="md"
            p={2}
            rounded="md"
          >
            {content}
          </HoverCard.Content>
        </HoverCard.Positioner>
      </Portal>
    </HoverCard.Root>
  );

  // return (
  //   <ChakraTooltip.Root {...rest}>
  //     <ChakraTooltip.Trigger asChild>{children}</ChakraTooltip.Trigger>
  //     <Portal disabled={!portalled} container={portalRef}>
  //       <ChakraTooltip.Positioner>
  //         <ChakraTooltip.Content ref={ref} {...contentProps}>
  //           {showArrow && (
  //             <ChakraTooltip.Arrow>
  //               <ChakraTooltip.ArrowTip />
  //             </ChakraTooltip.Arrow>
  //           )}
  //           {content}
  //         </ChakraTooltip.Content>
  //       </ChakraTooltip.Positioner>
  //     </Portal>
  //   </ChakraTooltip.Root>
  // );
}

export { Tooltip, type TooltipProps };
