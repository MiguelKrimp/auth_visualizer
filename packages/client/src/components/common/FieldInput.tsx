import { Field, Input } from '@chakra-ui/react';

type FieldInputProps = {
  placeholder: string;
  type?: string;
  value: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | undefined;
};

export function FieldInput({ placeholder, type, value, onChange, error }: FieldInputProps) {
  return (
    <Field.Root>
      <Field.Label>{placeholder}</Field.Label>
      <Input placeholder={placeholder} type={type} value={value} onChange={onChange} />
      <Field.HelperText color="red">{error}</Field.HelperText>
    </Field.Root>
  );
}
