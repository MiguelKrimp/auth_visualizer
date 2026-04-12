import { Box, Icon, IconButton, Switch } from '@chakra-ui/react';
import { useState } from 'react';
import { FaGear } from 'react-icons/fa6';

import type { SpySession } from '../../api/spySession/SpySession';
import { Tooltip } from '../common/Tooltip';

type SpySessionSettingsProps = {
  socket?: SpySession;
};

export function SpySessionSettings({ socket }: SpySessionSettingsProps) {
  const [open, setOpen] = useState(false);

  return (
    <Tooltip
      open={open}
      lazyMount
      positioning={{ placement: 'bottom-end' }}
      content={
        <Box m={2}>
          <Switch.Root
            defaultChecked={socket?.getDoSpy()}
            onCheckedChange={(d) => socket?.setDoSpy(d.checked)}
          >
            <Switch.HiddenInput />
            <Switch.Control bg="background" _checked={{ bg: 'accent1' }} />
            <Switch.Label>Halt authentication flows</Switch.Label>
          </Switch.Root>
        </Box>
      }
    >
      <IconButton
        bg="panel"
        rounded="full"
        disabled={!socket}
        color="muted"
        onClick={() => setOpen((o) => !o)}
      >
        <Icon
          transform="rotate(0deg)"
          transition="transform 1s ease"
          _hover={{ bg: 'panel', color: 'accent1', transform: 'rotate(180deg)' }}
        >
          <FaGear />
        </Icon>
      </IconButton>
    </Tooltip>
  );
}
