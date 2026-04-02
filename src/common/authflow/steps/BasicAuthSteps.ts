import { ValidAuthSteps } from './AuthSteps';

export type BasicAuthSteps = ValidAuthSteps<{
  Decode: {
    label: 'Decode Authorization header';
    data: {
      header: string;
      decoded: string;
    };
  };
  UserLookup: {
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
