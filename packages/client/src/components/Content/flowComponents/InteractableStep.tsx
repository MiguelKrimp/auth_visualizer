import { Button, type ButtonProps } from '@chakra-ui/react';
import { forwardRef, useCallback, useEffect, useState } from 'react';

import type { EventHandler } from '../../../util/EventHandler';

type InteractableStepProps = {
  disableAfterInteraction?: boolean;
} & ({ eventHandler?: EventHandler<void> } | { click: () => void });

export const InteractableStep = forwardRef<
  HTMLButtonElement,
  ButtonProps & React.PropsWithChildren<InteractableStepProps>
>((props, ref) => {
  const [interacted, setInteracted] = useState(false);

  const { children, disableAfterInteraction, ...rest } = props;

  const interactionFinished = useCallback(() => {
    setInteracted(true);
  }, []);

  useEffect(() => {
    if ('eventHandler' in props && props.eventHandler) {
      props.eventHandler.unsubscribe(interactionFinished);
      props.eventHandler.subscribe(interactionFinished);
    }
  }, [props, interactionFinished]);

  const handleClick = () => {
    if ('click' in props) {
      props.click();
      setInteracted(true);
    }
  };

  return (
    <Button
      ref={ref}
      disabled={props.disableAfterInteraction ? interacted : false}
      w="100%"
      h="unset"
      p={0}
      bg="transparent"
      display="flex"
      justifyContent="flex-start"
      onClick={handleClick}
      {...rest}
    >
      {props.children}
    </Button>
  );
});
