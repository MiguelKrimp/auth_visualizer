import { Badge } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';

import { SpySession } from '../../api/spySession/SpySession';
import { Tooltip } from '../common/Tooltip';

export function SpySessionControl() {
  const [socket, setSocket] = useState<SpySession>();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    SpySession.get()
      .then((socket) => {
        setSocket(socket);
        setError(undefined);
      })
      .catch((e) => {
        setError(e);
        setSocket(undefined);
      });
  }, []);

  const connectionStatus = useMemo(() => {
    if (socket && !error) {
      return `Connected`;
    } else if (error) {
      return 'Error';
    } else {
      return 'connecting...';
    }
  }, [socket, error]);

  const tooltipContent = useMemo(() => {
    if (socket) {
      return 'Socket ID: ' + socket.sessionId;
    } else if (error) {
      return `${error.name}: ${error.message}`;
    }
  }, [socket, error]);

  return (
    <Tooltip content={tooltipContent} disabled={!tooltipContent}>
      <Badge
        colorPalette={!error && !socket ? 'yellow' : error ? 'red' : 'green'}
        variant="surface"
        px={3}
        py={1}
        borderRadius="full"
        fontFamily="mono"
        letterSpacing="0.04em"
        color="background"
      >
        Spy Session: {connectionStatus}
      </Badge>
    </Tooltip>
  );
}
