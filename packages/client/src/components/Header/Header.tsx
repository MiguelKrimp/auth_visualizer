import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import {
  type PublicKeyCredentialCreationOptionsJSON,
  type PublicKeyCredentialRequestOptionsJSON,
  startAuthentication,
  startRegistration,
} from '@simplewebauthn/browser';

import { REST_HOST } from '../../api/host';
import { SpySessionControl } from './SpySessionControl';

export function Header() {
  return (
    <Flex
      as="header"
      borderWidth="1px"
      borderColor="line"
      bg="surface"
      borderRadius="xl"
      px={{ base: 4, md: 6 }}
      py={4}
      align="center"
      justify="space-between"
      boxShadow="0 0 0 1px rgba(57, 255, 20, 0.08), 0 0 40px rgba(57, 255, 20, 0.09)"
    >
      <Box>
        <Heading
          size="lg"
          color="bright"
          fontFamily="mono"
          letterSpacing="0.08em"
          textTransform="uppercase"
        >
          Auth Visualizer
        </Heading>
        <Text color="muted" fontSize="sm" mt={1}>
          Simulate and inspect authentication flows.
        </Text>
      </Box>
      <Button
        onClick={async () => {
          const response = await fetch(REST_HOST + '/login/webauthn/register?username=actualtest', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });

          const { options, token } = await response.json();

          const registrationOptions = options as PublicKeyCredentialCreationOptionsJSON;

          const credential = await startRegistration({ optionsJSON: registrationOptions });

          const registerResp = await fetch(REST_HOST + '/login/webauthn/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, response: credential }),
          });
          const registerResult = await registerResp.text();
          console.log('Register result:', registerResult);
        }}
      >
        WebAuthn Create
      </Button>
      <Button
        onClick={async () => {
          const authOptionRespone = await fetch(REST_HOST + '/login/webauthn', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });

          const { options, token } = await authOptionRespone.json();
          const authenticationOptions = options as PublicKeyCredentialRequestOptionsJSON;

          const credential = await startAuthentication({ optionsJSON: authenticationOptions });

          const authResponse = await fetch(REST_HOST + '/login/webauthn', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, response: credential }),
          });

          const authResult = await authResponse.text();
          console.log('Authentication result:', authResult);
        }}
      >
        WebAuthn Get
      </Button>
      <SpySessionControl />
    </Flex>
  );
}
