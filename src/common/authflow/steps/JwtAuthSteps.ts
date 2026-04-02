import { ValidAuthSteps } from './AuthSteps';

export type JWTAuthSteps = ValidAuthSteps<{
  ExtractToken: {
    label: 'Extract JWT from Authorization Header';
    data: {
      token: string;
    };
  };
  DecodeToken: {
    label: 'Decode JWT';
    data: {
      header?: any;
      payload?: any;
      signature: string | undefined;
    };
  };
  VerifyToken: {
    label: 'Verify JWT';
    data: {
      payload: any;
    };
  };
  LookupUser: {
    label: 'Lookup User from JWT Payload';
    data: {
      username: string;
    };
  };
}>;
