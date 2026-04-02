import { ValidAuthSteps } from '../AuthSteps';

export type JwtIssueSteps = ValidAuthSteps<{
  BuildClaims: {
    label: 'Build claims for JWT';
    data: {
      claims: any;
    };
  };
  CreateToken: {
    label: 'Create JWT from claims';
    data: {
      token: string;
    };
  };
}>;

export const JwtIssueStepKeys = [
  'BuildClaims',
  'CreateToken',
] as const satisfies (keyof JwtIssueSteps)[];
