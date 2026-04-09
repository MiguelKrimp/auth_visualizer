import { ValidAuthSteps } from '../AuthSteps';

export type JwtIssueSteps = ValidAuthSteps<{
  BuildClaims: {
    data: {
      claims: any;
    };
  };
  CreateToken: {
    data: {
      token: string;
    };
  };
}>;
