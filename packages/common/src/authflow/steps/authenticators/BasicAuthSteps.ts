import { ValidAuthSteps } from '../AuthSteps';

export type BasicAuthSteps = ValidAuthSteps<{
  DecodeBasicHeader: {
    data: {
      header: string;
      decoded: string;
    };
  };
  LookupUserPassword: {
    data: {
      username: string;
      passwordHash: string;
    };
  };
  VerifyPassword: {
    data: {
      sentPassword: string;
      valid: boolean;
    };
  };
}>;
