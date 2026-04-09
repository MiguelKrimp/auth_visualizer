import { ValidAuthSteps } from '../AuthSteps';

export type PasskeyRegisterSteps = ValidAuthSteps<{
  CreateRegistrationOptions: {
    data: {
      options: any;
      tokenClaims: any;
    };
  };
  VerifiedRegisterToken: {
    data: {
      tokenClaims: any;
    };
  };
  VerifyRegisterChallenge: {
    data: {
      verified: boolean;
      verificationResult: any;
    };
  };
  CreateUserAndAuthenticator: {
    data: {
      userId: string;
      authenticatorId: string;
    };
  };
}>;
