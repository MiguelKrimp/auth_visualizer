import { ValidAuthSteps } from '../AuthSteps';

export type JWTAuthSteps = ValidAuthSteps<{
  ExtractToken: {
    data: {
      token: string;
    };
  };
  DecodeToken: {
    data: {
      header?: any;
      payload?: any;
      signature: string | undefined;
    };
  };
  VerifyToken: {
    data: {
      payload: any;
    };
  };
  LookupUser: {
    data: {
      username: string;
    };
  };
}>;

export const JWTAuthStepKeys = [
  'ExtractToken',
  'DecodeToken',
  'VerifyToken',
  'LookupUser',
] as const satisfies (keyof JWTAuthSteps)[];
