const BasicAuthStepLabels = {
  DecodeBasicHeader: 'Decode Authorization header',
  LookupUserPassword: 'Lookup user in database',
  VerifyPassword: 'Verify password with bcrypt',
} as const satisfies Record<string, string>;

const JWTAuthStepLabels = {
  ExtractToken: 'Extract JWT from Authorization Header',
  DecodeToken: 'Decode JWT',
  VerifyToken: 'Verify JWT',
  LookupUser: 'Lookup User from JWT Payload',
} as const satisfies Record<string, string>;

const JwtIssueStepLabels = {
  BuildClaims: 'Build claims for JWT',
  CreateToken: 'Create JWT from claims',
} as const satisfies Record<string, string>;

export const StepLabels = {
  ...BasicAuthStepLabels,
  ...JWTAuthStepLabels,
  ...JwtIssueStepLabels,
} as const satisfies Record<string, string>;
