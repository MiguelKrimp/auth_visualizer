import { ValidAuthSteps } from '../AuthSteps';

export type PasskeyLoginSteps = ValidAuthSteps<{
  CreateAuthenticationOptions: {
    data: {
      options: any;
      tokenClaims: any;
    };
  };
  VerifiedChallengeToken: {
    data: {
      tokenClaims: any;
    };
  };
  LookupAuthenticator: {
    data: {
      lookup: {
        id: string;
        username: string;
      };
      authenticatorFound: boolean;
    };
  };
  VerifyLoginChallenge: {
    data: {
      verified: boolean;
      verificationResult: any;
    };
  };
  UpdateAuthenticatorCounter: {
    data: {
      newCounter: number;
    };
  };
}>;

export const PasskeyLoginStepKeys = [
  'CreateAuthenticationOptions',
  'VerifiedChallengeToken',
  'LookupAuthenticator',
  'VerifyLoginChallenge',
] as const satisfies (keyof PasskeyLoginSteps)[];
