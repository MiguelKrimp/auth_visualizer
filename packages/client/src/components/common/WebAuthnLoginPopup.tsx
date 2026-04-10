import { Button, Dialog, Flex, Heading, Link } from '@chakra-ui/react';
import { useState } from 'react';

import { DialogComponent } from './Dialog';
import { FieldInput } from './FieldInput';

type WebAuthnLoginPopupProps = {
  triggerComponent: React.ReactNode;
  onConfirm: (cred?: { username: string; password: string }) => void;
};

function RegisterPasskeyPage({ onConfirm }: Pick<WebAuthnLoginPopupProps, 'onConfirm'>) {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  return (
    <Flex direction="column" gap={1} m={2}>
      <FieldInput
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <FieldInput
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Dialog.ActionTrigger asChild>
        <Button
          bg="primary"
          disabled={!username || !password}
          onClick={() => onConfirm({ username, password })}
        >
          Register Passkey
        </Button>
      </Dialog.ActionTrigger>
    </Flex>
  );
}

export function WebAuthnLoginPopup({ triggerComponent, onConfirm }: WebAuthnLoginPopupProps) {
  const [signup, setSignup] = useState(false);

  return (
    <DialogComponent
      triggerComponent={triggerComponent}
      content={
        <Flex direction="column" gap={1} m={2}>
          <Heading mb={4} size="md">
            Login
          </Heading>
          {signup ? (
            <RegisterPasskeyPage onConfirm={onConfirm} />
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
