import type { StepIDs } from '@auth-visualizer/common/authflow/steps/StepIDs';

export const StepLabels: Record<StepIDs, string> = {
  // basic auth
  DecodeBasicHeader: 'Decode Authorization header',
  LookupUserPassword: 'Lookup user in database',
  VerifyPassword: 'Verify password with bcrypt',
  // JWT auth
  ExtractToken: 'Extract JWT from Authorization Header',
  DecodeToken: 'Decode JWT',
  VerifyToken: 'Verify JWT',
  LookupUser: 'Lookup User from JWT Payload',
  // jwt issue
  BuildClaims: 'Build claims for JWT',
  CreateToken: 'Create JWT from claims',
  // passkey register
  CreateRegistrationOptions: 'Create registration options',
  VerifiedRegisterToken: 'Verify registration token containing original challenge',
  VerifyRegisterChallenge: 'Verify registration challenge response',
  CreateUserAndAuthenticator: 'Create user and authenticator in database',
  // passkey login
  CreateAuthenticationOptions: 'Create authentication options',
  VerifiedChallengeToken: 'Verify challenge token containing original challenge',
  LookupAuthenticator: 'Lookup authenticator in database',
  VerifyLoginChallenge: 'Verify login challenge response',
  UpdateAuthenticatorCounter: 'Update authenticator counter in database',
} as const;
