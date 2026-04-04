import { Box, HStack, Heading, Separator, Tabs, Text } from '@chakra-ui/react';
import { AuthflowContent } from './AuthflowContent';
import { Tab } from './Tab';
import type { AuthFlow } from '../common/AuthFlow';

const flows: AuthFlow[] = [
  {
    id: 'basic-auth',
    label: 'Basic Auth',
    description:
      'HTTP Basic authentication sends a username and password with each request using the Authorization header. It is simple to implement and widely supported across clients and servers. Because credentials are repeatedly transmitted, it should only be used over HTTPS.',
    infoLink: 'https://www.rfc-editor.org/rfc/rfc7617',
    disabled: false,
    steps: [],
  },
  {
    id: 'jwt',
    label: 'JWT',
    description:
      'JSON Web Tokens are compact, signed tokens that carry claims about a user or session. They are commonly used for stateless authentication because servers can validate signatures without storing per-session state. Token lifetime, signing algorithm choice, and secure storage all strongly affect security.',
    infoLink: 'https://www.rfc-editor.org/rfc/rfc7519',
    disabled: false,
    steps: [],
  },
  {
    id: 'totp-2fa',
    label: '2FA (TOTP)',
    description:
      'Time-based one-time passwords add a second authentication factor beyond a password. A shared secret and current time are used to generate short-lived numeric codes in an authenticator app. This approach significantly improves account security, though phishing-resistant methods can provide stronger protection.',
    infoLink: 'https://www.rfc-editor.org/rfc/rfc6238',
    disabled: true,
    steps: [],
  },
  {
    id: 'oidc',
    label: 'OIDC',
    description:
      'OpenID Connect is an identity layer built on top of OAuth 2.0. It standardizes authentication flows and defines tokens like the ID Token for conveying user identity claims. OIDC is commonly used for single sign-on and delegation to trusted identity providers.',
    infoLink: 'https://openid.net/specs/openid-connect-core-1_0.html',
    disabled: true,
    steps: [],
  },
  {
    id: 'webauthn',
    label: 'WebAuthn',
    description:
      'WebAuthn enables strong, phishing-resistant authentication using public-key cryptography. Credentials are created and stored by authenticators such as security keys, platform biometrics, or passkeys. Since no shared secret password is sent to the server, it reduces credential theft and replay risks.',
    infoLink: 'https://www.w3.org/TR/webauthn-3/',
    disabled: true,
    steps: [],
  },
];

export function AuthSelection() {
  return (
    <Box
      as="main"
      mt={{ base: 5, md: 6 }}
      flex="1"
      minH="0"
      display="flex"
      flexDir="column"
      overflow="hidden"
      borderWidth="1px"
      borderColor="line"
      bg="panel"
      borderRadius="xl"
      p={{ base: 4, md: 6 }}
      boxShadow="0 0 0 1px rgba(102, 217, 239, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.03)"
    >
      <HStack justify="space-between" mb={4}>
        <Heading size="md" fontFamily="mono" color="accent1">
          Auth Selection
        </Heading>
        <Text fontSize="sm" color="muted">
          Select an auth flow, follow the instructions, and iterate through each step to learn how
          the flow works.
        </Text>
      </HStack>

      <Separator borderColor="line" mb={4} />

      <Tabs.Root
        variant="outline"
        defaultValue={flows[0]?.label}
        fitted
        display="flex"
        flexDir="column"
        flex="1 1 100%"
        minH="0"
        overflow="hidden"
        lazyMount
      >
        <Tabs.List bg="surface" p={0} borderRadius="lg" gapX="1">
          {flows.map((flow) => (
            <Tabs.Trigger
              key={flow.label}
              disabled={flow.disabled}
              value={flow.label}
              color="text"
              _hover={{ bg: 'surfaceAlt', color: 'bright' }}
              _selected={{
                bg: 'surfaceAlt',
                color: 'bright',
                borderColor: 'accent1',
                boxShadow: 'inset 0 -2px 0 #66d9ef',
              }}
            >
              <Tab key={flow.id} flow={flow} />
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        {flows.map((flow) => (
          <Tabs.Content
            key={flow.id}
            value={flow.label}
            flex="1 1 100%"
            minH="0"
            pt={4}
            display="flex"
            overflow="hidden"
          >
            <AuthflowContent key={flow.id} flow={flow} />
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </Box>
  );
}
