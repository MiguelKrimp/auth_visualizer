import { ValidAuthSteps } from '../AuthSteps';

export type BasicAuthSteps = ValidAuthSteps<{
  DecodeBasicHeader: {
    label: 'Decode Authorization header';
    data: {
      header: string;
      decoded: string;
    };
  };
  LookupUserPassword: {
    label: 'Lookup user in database';
    data: {
      username: string;
      passwordHash: string;
    };
  };
  VerifyPassword: {
    label: 'Verify password with bcrypt';
    data: {
      sentPassword: string;
      valid: boolean;
    };
  };
}>;

export const BasicAuthStepKeys = [
  'DecodeBasicHeader',
  'LookupUserPassword',
  'VerifyPassword',
] as const satisfies (keyof BasicAuthSteps)[];
