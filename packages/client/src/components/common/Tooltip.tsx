import { HoverCard, Portal } from '@chakra-ui/react';
import * as React from 'react';

interface TooltipProps extends HoverCard.RootProps {
  content: React.ReactNode;
  contentProps?: HoverCard.ContentProps;
  positionerProps?: HoverCard.PositionerProps;
  disabled?: boolean;
}

function Tooltip(props: TooltipProps) {
  const { children, disabled, content, contentProps, positionerProps, ...rest } = props;

  if (disabled) return children;

  return (
    <HoverCard.Root size="sm" {...rest}>
      <HoverCard.Trigger asChild>{children}</HoverCard.Trigger>
      <Portal>
        <HoverCard.Positioner {...positionerProps}>
          <HoverCard.Content
            bg="surfaceAlt"
            color="text"
            borderColor="line"
            borderWidth="1px"
            boxShadow="md"
            p={2}
            rounded="md"
            {...contentProps}
          >
            {content}
          </HoverCard.Content>
        </HoverCard.Positioner>
      </Portal>
    </HoverCard.Root>
  );
}

export { Tooltip, type TooltipProps };
