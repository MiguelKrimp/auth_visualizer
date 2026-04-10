import { Button, Dialog, Field, Flex, Heading, Input, Link } from '@chakra-ui/react';
import { useState } from 'react';

import { DialogComponent } from './Dialog';

type BasicLoginPopupProps = {
  triggerComponent: React.ReactNode;
  onConfirm: (username?: string) => void;
};

export function WebAuthnLoginPopup({ triggerComponent, onConfirm }: BasicLoginPopupProps) {
  const [signup, setSignup] = useState(false);
  const [username, setUsername] = useState<string>('');

  return (
    <DialogComponent
      triggerComponent={triggerComponent}
      content={
        <Flex direction="column" gap={1} m={2}>
          <Heading mb={4} size="md">
            Login
          </Heading>
          {signup ? (
            <>
              <Field.Root mb={1}>
                <Field.Label>Username</Field.Label>
                <Input
                  placeholder="Enter your username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Field.Root>
              <Dialog.ActionTrigger asChild>
                <Button bg="primary" disabled={!username} onClick={() => onConfirm(username)}>
                  Sign up with Passkey
                </Button>
              </Dialog.ActionTrigger>
            </>
          ) : (
            <Dialog.ActionTrigger asChild>
              <Button bg="primary" onClick={() => onConfirm()}>
                Login with Passkey
              </Button>
            </Dialog.ActionTrigger>
          )}
          <Button bg="transparent" asChild onClick={() => setSignup((prev) => !prev)}>
            <Link color="accent1">{signup ? 'Or log in' : "Don't have a passkey? Sign up"}</Link>
          </Button>
        </Flex>
      }
    />
  );
}
