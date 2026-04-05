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

export const JwtIssueStepKeys = [
  'BuildClaims',
  'CreateToken',
] as const satisfies (keyof JwtIssueSteps)[];
