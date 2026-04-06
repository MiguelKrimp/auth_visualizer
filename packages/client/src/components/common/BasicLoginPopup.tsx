import { Button, Dialog, Em, Field, Flex, Input, Link } from '@chakra-ui/react';
import { useCallback, useState } from 'react';

import { UserEndpoint } from '../../api/rest/UserEndpoint';
import { DialogComponent } from './Dialog';

type FieldInputProps = {
  placeholder: string;
  type?: string;
  value: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | undefined;
};

function FieldInput({ placeholder, type, value, onChange, error }: FieldInputProps) {
  return (
    <Field.Root>
      <Field.Label>{placeholder}</Field.Label>
      <Input placeholder={placeholder} type={type} value={value} onChange={onChange} />
      <Field.HelperText color="red">{error}</Field.HelperText>
    </Field.Root>
  );
}

type LoginButtonsProps = {
  onConfirm: () => void;
  confirmLabel: string;
  switchLabel: string;
  onSwitch: () => void;
  disabled: boolean;
};

function LoginButtons({
  onConfirm,
  confirmLabel,
  switchLabel,
  onSwitch,
  disabled,
}: LoginButtonsProps) {
  return (
    <>
      <Button bg="primary" mt={4} disabled={disabled} onClick={onConfirm}>
        {confirmLabel}
      </Button>
      <Button bg="transparent" asChild onClick={onSwitch}>
        <Link color="accent1">{switchLabel}</Link>
      </Button>
    </>
  );
}

type FormProps = Pick<BasicLoginPopupProps, 'onConfirm'> & {
  onSwitch: () => void;
  close: () => void;
};

function LoginForm({ onConfirm, onSwitch, close }: FormProps) {
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
      <LoginButtons
        onConfirm={() => {
          close();
          onConfirm(username!, password!);
        }}
        confirmLabel="Login"
        switchLabel="Don't have an account? Sign up"
        onSwitch={onSwitch}
        disabled={!username || !password}
      />
    </Flex>
  );
}

function SignupForm({ onConfirm, onSwitch, close }: FormProps) {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [usernameError, setUsernameError] = useState<string>();

  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const signUp = useCallback(
    (username: string, password: string) => {
      new UserEndpoint()
        .post(username, password)
        .then(() => {
          close();
          onConfirm(username, password);
        })
        .catch((error) => {
          setUsernameError(error.message);
        });
    },
    [onConfirm, close],
  );

  return (
    <Flex direction="column" gap={1} m={2}>
      <FieldInput
        placeholder="Username"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
          setUsernameError(undefined);
        }}
        error={usernameError}
      />
      <FieldInput
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <FieldInput
        placeholder="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={confirmPassword && !passwordsMatch ? "Passwords don't match" : undefined}
      />
      <LoginButtons
        onConfirm={() => signUp(username!, password!)}
        confirmLabel="Sign Up"
        switchLabel="Already have an account? Log in"
        onSwitch={onSwitch}
        disabled={!username || !password || !confirmPassword || !passwordsMatch || !!usernameError}
      />
    </Flex>
  );
}

type BasicLoginPopupProps = {
  triggerComponent: React.ReactNode;
  onConfirm: (username: string, password: string) => void;
};

export function BasicLoginPopup({ triggerComponent, onConfirm }: BasicLoginPopupProps) {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <DialogComponent
      triggerComponent={triggerComponent}
      content={
        <Dialog.Context>
          {(store) => (
            <>
              {showSignup ? (
                <SignupForm
                  onConfirm={onConfirm}
                  onSwitch={() => setShowSignup(false)}
                  close={() => store.setOpen(false)}
                />
              ) : (
                <LoginForm
                  onConfirm={onConfirm}
                  onSwitch={() => setShowSignup(true)}
                  close={() => store.setOpen(false)}
                />
              )}
              <Em>
                Dont worry, these accounts are just for demo purposes and will be deleted after 24
                hours. You may create as many accounts as you like!
              </Em>
            </>
          )}
        </Dialog.Context>
      }
    />
  );
}
